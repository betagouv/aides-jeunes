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
                spyOn(SituationService, 'createIndividusList').andReturn([
                    {name: 'Vous'}
                ]);
                $controller('FoyerCaptureRevenusModalCtrl', {
                    $scope: scope,
                    $modalInstance: {},
                    SituationService: SituationService
                });
            });
        });

        it('should be initialized with the individus list', function() {
            expect(scope.selectedRessourcesByIndividu).toEqual({
                'Vous': {},
            });
        });
    });

    it('Should init an array of the last 3 months', function() {
        function isoDate(minusMonths) {
            var date = new Date();
            var result = date.setMonth(date.getMonth() - minusMonths);
            var month = date.getMonth() + 1;
            var prefix = month < 10 ? '0' : '';
            month = prefix + month;
            result = '' + date.getFullYear() + '-' + month;

            return result;
        }

        expect(scope.months.length).toBe(3);
        expect(scope.months[0].id).toBe(isoDate(3));
        expect(scope.months[2].id).toBe(isoDate(1));
    });
});
