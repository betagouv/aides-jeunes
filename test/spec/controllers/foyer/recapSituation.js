'use strict';

describe('Controller: RecapSituationCtrl', function() {

    var scope, _ressourceTypes_;

    beforeEach(function() {
        module('ddsApp');
        inject(function(ressourceTypes, $rootScope) {
            _ressourceTypes_ = ressourceTypes;
            scope = $rootScope.$new();
            scope.situation = {
                individus: [{}],
                foyer_fiscal: {},
            };
        });
    });

    var initController = function() {
        inject(function($controller) {
            $controller('RecapSituationCtrl', {
                $scope: scope,
                ressourceTypes: _ressourceTypes_
            });
        });
    };

    describe('shouldDisplayPersonRessourcesRecap', function() {
        it('be false for demandeur without hasRessources', function() {
            // given
            scope.situation.dateDeValeur = '2013-04-05';
            var individu = {
                role: 'demandeur',
            };
            scope.situation.individus.push(individu);
            initController();

            // when
            var value = scope.shouldDisplayPersonRessourcesRecap(individu);

            // then
            expect(value).toBeFalsy();
        });

        it('be true for demandeur with hasRessources == true', function() {
            // given
            scope.situation.dateDeValeur = '2013-04-05';
            var individu = {
                role: 'demandeur',
                hasRessources: true,
            };
            scope.situation.individus.push(individu);
            initController();

            // when
            var value = scope.shouldDisplayPersonRessourcesRecap(individu);

            // then
            expect(value).toBeTruthy();
        });

        it('be true for demandeur with hasRessources == false', function() {
            // given
            scope.situation.dateDeValeur = '2013-04-05';
            var individu = {
                role: 'demandeur',
                hasRessources: true,
            };
            scope.situation.individus.push(individu);
            initController();

            // when
            var value = scope.shouldDisplayPersonRessourcesRecap(individu);

            // then
            expect(value).toBeTruthy();
        });

        it('be true for a kid with ressources', function() {
            // given
            scope.situation.dateDeValeur = '2013-04-05';
            var individu = {
                role: 'enfant',
                hasRessources: true,
                salaire_net: {
                    '2011': 1000,
                },
            };
            scope.situation.individus.push(individu);
            initController();

            // when
            var value = scope.shouldDisplayPersonRessourcesRecap(individu);

            // then
            expect(value).toBeTruthy();
        });

        it('be false for a kid without ressources', function() {
            // given
            scope.situation.dateDeValeur = '2013-04-05';
            var individu = {
                role: 'enfant',
                hasRessources: false,
            };
            scope.situation.individus.push(individu);
            initController();

            // when
            var value = scope.shouldDisplayPersonRessourcesRecap(individu);

            // then
            expect(value).toBeFalsy();
        });
    });

    describe('ressourcesYearMoins2 event', function() {
        it('should create a ressourcesYearMoins2 cache', function() {
            // given
            scope.situation.dateDeValeur = '2013-04-05';
            scope.situation.individus.push({
                role: 'demandeur',
                pensions_alimentaires_versees: {
                    '2011': 1000,
                },
            });
            initController();

            // when
            scope.$broadcast('ym2Captured');

            // then
            expect(scope.ressourcesYearMoins2Captured).toBeTruthy();
            expect(scope.ressourcesYearMoins2[0]).toBeTruthy();
            expect(scope.ressourcesYearMoins2[0].label).toEqual('Vous');
            expect(scope.ressourcesYearMoins2[0].ressources[0]).toEqual({ label: 'Pensions alimentaires versées', montant: 1000 });
        });
    });
});
