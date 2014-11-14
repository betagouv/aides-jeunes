'use strict';

describe('Controller: FoyerRessourcesCtrl', function() {

    beforeEach(function() {
        module('ddsApp');
    });

    describe('initialization', function() {
        it('should create an array of individu references containing their label and an empty selected ressources map', function() {
            // given
            var scope = {
                situation: { individus: [{}, {}] },
                $on: function() {}
            };

            // when
            inject(function($controller) {
                $controller('FoyerRessourcesCtrl', {
                    $scope: scope,
                    $modalInstance: {}
                });
            });

            // then
            expect(scope.individuRefs[0].selectedRessourceTypes).toBeDefined();
            expect(scope.individuRefs[1].selectedRessourceTypes).toBeDefined();
        });
    });
});
