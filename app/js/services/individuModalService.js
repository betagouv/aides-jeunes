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
                        return options;
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
