'use strict';

describe('Controller: FoyerPensionsAlimentairesCtrl', function() {

    var scope, _ressourceTypes_, form;

    beforeEach(function() {
        scope = {
            $on: function() {},
            $emit: function() {},
            situation: { dateDeValeur: '2013-04-10' }
        };
        form = { $valid: true };
        module('ddsApp');
        inject(function(ressourceTypes) {
            _ressourceTypes_ = ressourceTypes;
        });
    });

    var initController = function() {
        inject(function($controller) {
            $controller('FoyerPensionsAlimentairesCtrl', {
                $scope: scope,
                ressourceTypes: _ressourceTypes_
            });
        });
    };

    describe('initialization', function() {
        it('should create an empty view model for each parent with zero-filled amounts', function() {
            // given
            scope.situation.individus = [{ role: 'demandeur' }, { role: 'conjoint' }, { role: 'enfant' }];

            // when
            initController();

            // then
            expect(scope.situation.parentsPayPensionsAlimentaires).toBe(false);
            expect(scope.individusVM.length).toBe(2);
            expect(scope.individusVM[0].individu).toEqual(scope.situation.individus[0]);
            expect(scope.individusVM[0].label).toEqual('Vous');
            expect(scope.individusVM[0].pensionsVersees.montantsMensuels).toEqual([0, 0, 0]);
            expect(scope.individusVM[0].pensionsVersees.montantAnnuel).toBe(0);
        });

        it('should map previous pensions alimentaires', function() {
            // given
            scope.situation.individus = [{
                role: 'demandeur',
                ressources: [
                    { type: 'pensionsAlimentairesVersees', periode: '2013-03', montant: 350 },
                    { type: 'pensionsAlimentairesVersees', periode: '2013-02', montant: 300 },
                    { type: 'pensionsAlimentairesVersees', periode: '2013-01', montant: 250 }
                ]
            }];

            // when
            initController();

            // then
            expect(scope.situation.parentsPayPensionsAlimentaires).toBe(true);
            expect(scope.individusVM[0].pensionsVersees.montantsMensuels).toEqual([250, 300, 350]);
            expect(scope.individusVM[0].pensionsVersees.montantAnnuel).toBe(900);
        });
    });

    describe('submit()', function() {
        it('should flatten amounts', function() {
            // given
            scope.situation.individus = [{ role: 'demandeur', ressources: [] }];
            initController();
            scope.situation.parentsPayPensionsAlimentaires = true;
            scope.individusVM[0].pensionsVersees.montantsMensuels = [100, 100, 100];
            scope.individusVM[0].pensionsVersees.montantAnnuel = 1200;

            // when
            scope.submit(form);

            // then
            var individu = scope.situation.individus[0];
            expect(individu.ressources.length).toBe(12);
            expect(individu.ressources[0].montant).toBe(100);
        });

        it('should delete previous pensions if answers no', function() {
            // given
            scope.situation.individus = [{
                role: 'demandeur',
                ressources: [
                    { type: 'pensionsAlimentairesVersees', periode: '2013-03', montant: 350 },
                    { type: 'foo', periode: '2013-03', montant: 350 }
                ]
            }];
            initController();

            // when
            scope.situation.parentsPayPensionsAlimentaires = false;
            scope.submit(form);

            // then
            var individu = scope.situation.individus[0];
            expect(individu.ressources.length).toBe(1);
            expect(individu.ressources[0].type).toBe('foo');
        });
    });
});
