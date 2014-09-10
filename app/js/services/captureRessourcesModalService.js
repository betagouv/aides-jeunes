'use strict';

angular.module('ddsApp').factory('CaptureRessourcesModalService', function($modal, SituationService) {
    return {
        open: function(isRessourcesN2) {
            return $modal.open({
                templateUrl: '/partials/capture-ressources-modal.html',
                controller: 'CaptureRessourcesModalCtrl',
                resolve: {
                    individus: function() {
                        return SituationService.createIndividusList(SituationService.restoreLocal());
                    },
                    ressourcesN2: function() {
                        return isRessourcesN2;
                    }
                },
                size: 'lg',
                backdrop: 'static',
                keyboard: false
            });
        }
    };
});
