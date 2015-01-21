'use strict';

/* global _ */

describe('Controller: FoyerRessourcesCtrl', function() {

    var scope, _ressourceTypes_;

    beforeEach(function() {
        scope = { $on: function() {}, $emit: function() {}, situation: {} };
        module('ddsApp');
        inject(function(ressourceTypes) {
            _ressourceTypes_ = ressourceTypes;
        });
    });

    var initController = function() {
        inject(function($controller) {
            $controller('FoyerRessourcesCtrl', {
                $scope: scope,
                ressourceTypes: _ressourceTypes_
            });
        });
    };

    describe('initialization', function() {
        it('should create an individus view model containing their label, an empty selected ressources map and an empty ressources array', function() {
            // given
            scope.situation.individus = [{ role: 'demandeur' }, { role: 'conjoint' }];

            // when
            initController();

            // then
            expect(scope.individusVM[0].selectedRessourceTypes).toEqual([]);
            expect(scope.individusVM[1].selectedRessourceTypes).toEqual([]);
            expect(scope.individusVM[0].label).toBe('Vous');
            expect(scope.individusVM[0].ressources.length).toBe(0);
        });

        it('should retrieve the selected ressource types in the selectedRessourceTypes map if previously selected', function() {
            // given
            scope.situation.individus = [
                { ressources: [{ type: 'revenusSalarie' }] },
                { ressources: [{ type: 'stage' }, { type: 'revenusSalarie' }] },
                { ressources: [] }
            ];

            // when
            initController();

            // then
            expect(scope.individusVM[0].selectedRessourceTypes).toEqual({ revenusSalarie: true});
            expect(scope.individusVM[1].selectedRessourceTypes).toEqual({ revenusSalarie: true, stage: true });
            expect(scope.individusVM[2].selectedRessourceTypes).toEqual({});
        });

        it('should map the previous individu ressource amounts to the view model', function() {
            // given
            scope.situation.dateDeValeur = '2013-04-10';
            _ressourceTypes_ = [{ id: 'toto' }];
            scope.situation.individus = [{
                ressources: [
                    { type: 'toto', periode: '2013-03', montant: 100 },
                    { type: 'toto', periode: '2012-10', montant: 100 },
                ]
            }];

            // when
            initController();

            // then
            expect(scope.individusVM[0].ressources.length).toBe(1);
            expect(scope.individusVM[0].ressources[0].type).toBe(_ressourceTypes_[0]);
            expect(scope.individusVM[0].ressources[0].montantsMensuels).toEqual([0, 0, 100]);
            expect(scope.individusVM[0].ressources[0].montantAnnuel).toBe(200);
        });

        it('should round amounts', function() {
            // given
            scope.situation.dateDeValeur = '2013-04-10';
            _ressourceTypes_ = [{ id: 'toto' }];
            scope.situation.individus = [{
                ressources: [
                    { type: 'toto', periode: '2013-03', montant: 5.5 },
                    { type: 'toto', periode: '2013-02', montant: 4.4 },
                    { type: 'toto', periode: '2013-01', montant: 66.6 },
                ]
            }];

            // when
            initController();

            // then
            expect(scope.individusVM[0].ressources.length).toBe(1);
            expect(scope.individusVM[0].ressources[0].type).toBe(_ressourceTypes_[0]);
            expect(scope.individusVM[0].ressources[0].montantsMensuels).toEqual([67, 4, 6]);
            expect(scope.individusVM[0].ressources[0].montantAnnuel).toBe(77);
        });
    });

    describe('function submit()', function() {
        it('should apply ressource amounts to the individu model, flattened by month', function() {
            // given
            scope.situation.dateDeValeur = '2013-04-10';
            var individu = {};
            scope.situation.individus = [individu];
            initController();
            scope.individusVM[0].ressources = [{
                type: { id: 'toto' },
                montantsMensuels: [100, 200, 300],
                montantAnnuel: 690
            }];
            var form = { $valid: true };

            // when
            scope.submit(form);

            // then
            expect(individu.ressources.length).toBe(12);
            expect(individu.ressources[0]).toEqual({ type: 'toto', periode: '2013-03', montant: 300 });
            expect(individu.ressources[1]).toEqual({ type: 'toto', periode: '2013-02', montant: 200 });
            expect(individu.ressources[2]).toEqual({ type: 'toto', periode: '2013-01', montant: 100 });
            expect(individu.ressources[3]).toEqual({ type: 'toto', periode: '2012-12', montant: 10 });
            expect(individu.ressources[11]).toEqual({ type: 'toto', periode: '2012-04', montant: 10 });
        });

        it('should remove previous ressources of the individu', function() {
            scope.situation.dateDeValeur = '2013-04-10';
            var individu = {};
            scope.situation.individus = [individu];
            initController();
            scope.individusVM[0].ressources = [{
                type: { id: 'toto' },
                montantsMensuels: [100, 100, 100],
                montantAnnuel: 750
            }];
            individu.ressources = [
                { periode: '2013-03', type: 'toto', montant: 133},
                { periode: '2013-03', type: 'tata', montant: 122 }
            ];
            var form = { $valid: true };

            // when
            scope.submit(form);

            // then
            expect(individu.ressources.length).toBe(12);
            expect(_.where(individu.ressources, { type: 'toto' }).length).toBe(12);
            expect(individu.ressources[0].montant).toBe(100);
        });

        it('should fill the interruptedRessources field of each individu with ressources declared as interrupted', function() {
            // given
            initController();
            var individu = {};
            scope.individusVM = [
                {
                    individu: individu,
                    ressources: [
                        { type: { id: 'test' }, montantsMensuels: [], interrupted: false },
                        { type: { id: 'test2' }, montantsMensuels: [], interrupted: true }
                    ]
                }
            ];
            var form = { $valid: true };

            // when
            scope.submit(form);

            // then
            expect(individu.interruptedRessources.length).toBe(1);
            expect(individu.interruptedRessources[0]).toEqual('test2');
        });

        it('should emit the "ressourcesUpdated" event', function() {
            // given
            var form = { $valid: true };
            initController();
            spyOn(scope, '$emit');

            // when
            scope.submit(form);

            // then
            expect(scope.$emit).toHaveBeenCalledWith('ressources');
        });
    });
});
