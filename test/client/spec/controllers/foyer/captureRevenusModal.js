'use strict';

describe('Controller: FoyerCaptureRevenusModalCtrl', function() {

    var scope = {};

    beforeEach(function() {
        module('ddsApp');
        inject(function($controller) {
            $controller('FoyerCaptureRevenusModalCtrl', {$scope: scope, $modalInstance: {}});
        });
    });

    describe('Map of selected resources', function() {
        beforeEach(function() {
            inject(function($controller, SituationService) {
                var individus = {name: 'Vous'};
                spyOn(SituationService, 'createIndividusList').andReturn([individus]);
                $controller('FoyerCaptureRevenusModalCtrl', {
                    $scope: scope,
                    $modalInstance: {},
                    SituationService: SituationService
                });
            });
        });

        it('should be initialized with a map of individus indexed by their name', function() {
            expect(scope.selectedRessourcesByIndividu).toEqual({
                'Vous': {},
            });
        });
    });

    it('Should init an array of the last 3 months', function() {
        expect(scope.months.length).toBe(3);
        var date = new Date();
        var month = '' + (date.getMonth() - 2);
        if (month.length === 1) {
            month = '0' + month;
        }
        var expectedDate = '' + date.getFullYear() + '-' + month;
        expect(scope.months[0].id).toBe(expectedDate);
    });
});
