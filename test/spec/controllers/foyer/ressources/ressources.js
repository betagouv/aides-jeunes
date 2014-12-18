'use strict';

/* global _ */

describe('Controller: FoyerRessourcesCtrl', function() {

    beforeEach(function() {
        module('ddsApp');
    });

    describe('initialization', function() {
        var scope = { $on: function() {}, situation: {} };

        var initController = function() {
            inject(function($controller) {
                $controller('FoyerRessourcesCtrl', {
                    $scope: scope
                });
            });
        };

        it('should create an array of individu references containing their label and an empty selected ressources map', function() {
            // given
            scope.situation.individus = [{ role: 'demandeur' }, { role: 'conjoint' }];

            // when
            initController();

            // then
            expect(scope.individuRefs[0].selectedRessourceTypes).toEqual([]);
            expect(scope.individuRefs[1].selectedRessourceTypes).toEqual([]);
            expect(scope.individuRefs[0].label).toBe('Vous');
        });

        it('should retrieve the selected ressource types in the selectedRessourceTypesMap if previously selected', function() {
            // given
            scope.situation.individus = [
                { ressources: [{ type: 'revenusSalarie' }] },
                { ressources: [{ type: 'stage' }, { type: 'revenusSalarie' }] },
                { ressources: [] },
                {}
            ];

            // when
            initController();

            // then
            expect(scope.individuRefs[0].selectedRessourceTypes).toEqual({ revenusSalarie: true});
            expect(scope.individuRefs[1].selectedRessourceTypes).toEqual({ revenusSalarie: true, stage: true });
            expect(scope.individuRefs[2].selectedRessourceTypes).toEqual({});
            expect(scope.individuRefs[3].selectedRessourceTypes).toEqual({});
        });

        it('should retrieve the selected ressource types for each person and put it in the individuRefs.selectedRessourceTypes field', function() {
            // given
            scope.situation.individus = [
                { ressources: [{ type: 'revenusSalaries' }] },
                { ressources: [{ type: 'stage' }] },
                { ressources: [] },
                {}
            ];

            // when
            initController();

            // then
            expect(_.pluck(scope.individuRefs, 'selectedRessourceTypes')).toEqual([
                { revenusSalaries: true },
                { stage: true },
                {},
                {}
            ]);
        });
    });

    describe('function applyIndividuRefsRessourcesToIndividus()', function() {
        it('should fill the individu.interruptedRessources field with ressources declared as interrupted', function() {
            // given
            var individu = {};

            var scope = { $on: function() {}, situation: {} };

            var initController = function() {
                inject(function($controller) {
                    $controller('FoyerRessourcesCtrl', {
                        $scope: scope
                    });
                });
            };

            initController();

            scope.individuRefs = [
                {
                    individu: individu,
                    ressources: [
                        { type: { id: 'test' }, interrupted: false },
                        { type: { id: 'test2' }, interrupted: true }
                    ]
                }
            ];
            scope.momentDebutAnnee = { format: function() {}};
            scope.momentFinAnnee = { format: function() {}};

            // when
            scope.applyIndividuRefsRessourcesToIndividus();

            // then
            expect(individu.interruptedRessources.length).toBe(1);
            expect(individu.interruptedRessources[0]).toEqual('test2');
        });
    });
});
