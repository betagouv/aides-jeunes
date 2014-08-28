'use strict';

describe('Controller: FoyerCaptureRevenusModalCtrl', function() {

    beforeEach(function() {
        module('ddsApp');
    });

    it('Should initialize the map of selected resources by individus indexed by the individus labels', function() {
        // given
        var scope = {};

        // when
        inject(function($controller, SituationService) {
            spyOn(SituationService, 'createIndividusList').andReturn([{role: 'demandeur'}, {role: 'conjoint'}]);
            $controller('FoyerCaptureRevenusModalCtrl', {
                $scope: scope,
                $modalInstance: {}
            });
        });

        // then
        expect(scope.selectedRessourcesByIndividu).toEqual({'Vous': {}, 'Votre conjoint': {}});
    });

    it('Should init an array of the last 3 months', function() {
        // given
        var scope = {};

        // when
        inject(function($controller, SituationService) {
            spyOn(SituationService, 'createIndividusList').andReturn([]);
            $controller('FoyerCaptureRevenusModalCtrl', {$scope: scope, $modalInstance: {}});
        });

        // then
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
