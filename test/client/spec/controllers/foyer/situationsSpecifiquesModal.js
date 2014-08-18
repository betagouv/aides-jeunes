'use strict';

describe('Controller: FoyerSituationsSpecifiquesModalCtrl', function() {

    beforeEach(function() {
        module('ddsApp');
    });

    it('Should initialize the opened specific situations given the individuals statuses', function() {
        // given
        var scope = {};
        inject(function($controller, SituationService) {
            spyOn(SituationService, 'createIndividusList').andReturn([
                {demandeurEmploi: true},
                {etudiant: true},
                {retraite: false}
            ]);

            $controller('FoyerSituationsSpecifiquesModalCtrl', {$scope: scope, $modalInstance: {}});
        });

        // then
        expect(scope.openedSituations).toEqual({demandeurEmploi: true, etudiant: true});
    });

    describe('var situationsSpecifiquesCaptured', function() {
        var scope;
        var situation;
        var modalInstance;

        beforeEach(function() {
            scope = {};
            situation = {};
            modalInstance = {close: function() {}};
            inject(function($controller, SituationService) {
                spyOn(SituationService, 'restoreLocal').andReturn(situation);
                spyOn(SituationService, 'createIndividusList').andReturn([]);
                $controller('FoyerSituationsSpecifiquesModalCtrl', {$scope: scope, $modalInstance: modalInstance});
            });
        });

        it('var situationsSpecifiquesCaptured should be initially undefined', function() {
            // then
            expect(situation.situationsSpecifiquesCaptured).toBeUndefined();
        });

        it('function submit() should mark specific situations as captured in the global situation and close the modal', function() {
            // given
            spyOn(modalInstance, 'close');

            // when
            scope.submit();

            // then
            expect(situation.situationsSpecifiquesCaptured).toBe(true);
            expect(modalInstance.close).toHaveBeenCalled();
        });
    });
});
