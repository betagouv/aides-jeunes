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
                { ressources: [{ type: 'test' }] },
                { ressources: [{ type: 'test2' }] },
                { ressources: [] },
                {}
            ];

            // when
            initController();

            // then
            expect(scope.selectedRessourceTypes).toEqual({ test: true, test2: true });
        });

        it('should retrieve the selected ressource types for each person and put it in the individuRefs.selectedRessourceTypes field', function() {
            // given
            scope.situation.individus = [
                { ressources: [{ type: 'revenusSalaries' }] },
                { ressources: [{ type: 'revenusSalaries' }] },
                { ressources: [] },
                {}
            ];

            // when
            initController();

            // then
            expect(_.pluck(scope.individuRefs, 'selectedRessourceTypes')).toEqual([
                { revenusSalaries: true },
                { revenusSalaries: true },
                {},
                {}
            ]);
        });
    });
});
