'use strict';

describe('Controller: FoyerRessourcesCtrl', function() {

    var scope;

    beforeEach(function() {
        module('ddsApp');
        scope = {};
    });

    describe('initialization', function() {
        it('should create an array of individu references containing their label and an empty selected ressources map', function() {
            // given
            var individus = [{}, {}];

            // when
            inject(function($controller) {
                $controller('FoyerRessourcesCtrl', {
                    $scope: scope,
                    $modalInstance: {},
                    individus: individus
                });
            });

            // then
            expect(scope.individuRefs[0].selectedRessourceTypes).toBeDefined();
            expect(scope.individuRefs[1].selectedRessourceTypes).toBeDefined();
        });
    });
});
