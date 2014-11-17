'use strict';

describe('Controller: FoyerRessourceTypesCtrl', function() {

    beforeEach(function() {
        module('ddsApp');
    });

    describe('initialization', function() {
        it('should put the previously selected ressource types in the selectedRessourceTypesMap', function() {
            // given
            var scope = {
                $on: function() {},
                selectedRessourceTypes: {},
                situation: {
                    individus: [
                        { ressources: [{ type: 'test' }] },
                        { ressources: [{ type: 'test2' }] },
                        { ressources: [] },
                        {}
                    ]
                }
            };

            // when
            inject(function($controller) {
                $controller('FoyerRessourceTypesCtrl', {
                    $scope: scope
                });
            });

            // then
            expect(scope.selectedRessourceTypes).toEqual({ test: true, test2: true });
        });
    });
});
