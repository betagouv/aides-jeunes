'use strict';

angular.module('ddsApp').factory('IndividuModalService', function($modal) {
    return {
        open: function(options) {
            if (false !== options.cancelable) {
                options.cancelable = true;
            }

            var modalParams = {
                templateUrl: '/partials/foyer/individu-modal.html',
                controller: 'FoyerIndividuModalCtrl',
                resolve: {
                    options: function() {
                        return {
                            individuType: options.individuType,
                            modalTitle: options.modalTitle,
                            askFirstName: options.askFirstName,
                            cancelable: options.cancelable
                        };
                    }
                }
            };

            if (!options.cancelable) {
                modalParams.backdrop = 'static';
                modalParams.keyboard = false;
            }

            return $modal.open(modalParams).result;
        }
    };
});
