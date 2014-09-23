'use strict';

angular.module('ddsApp').factory('CaptureRessourcesModalService', function($modal, SituationService) {
    return {
        open: function(isRessourcesN2) {
            var modalOptions = {
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
            };

            if (!isRessourcesN2) {
                modalOptions.backdrop = 'static';
                modalOptions.keyboard = false;
            }

            return $modal.open(modalOptions);
        }
    };
});
