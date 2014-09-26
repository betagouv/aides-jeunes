'use strict';

angular.module('ddsApp').factory('IndividuModalService', function($modal, SituationService) {
    var open = function(options) {
        if (false !== options.cancelable) {
            options.cancelable = true;
        }

        var modalParams = {
            templateUrl: '/partials/foyer/individu-modal.html',
            controller: 'FoyerIndividuModalCtrl',
            size: 'lg',
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
    };

    return {
        openDemandeur: function() {
            return open({
                individuType: 'demandeur',
                modalTitle: 'Vous',
                cancelable: false,
                checkResidenceStability: true,
                minAge: 12,
                maxAge: 120
            });
        },

        openConjoint: function() {
            var situation = SituationService.restoreLocal();
            return open({
                individuType: 'conjoint',
                modalTitle: 'Votre conjoint',
                askRelationType: true,
                checkResidenceStability: true,
                minAge: 12,
                maxAge: 120
            }).then(function() {}, function() {
                situation.livesAlone = undefined;
            });
        },

        openEnfant: function() {
            return open({
                individuType: 'enfant',
                modalTitle: 'Votre enfant',
                askFirstName: true,
                maxAge: 25
            });
        },

        openPersonneACharge: function() {
            return open({
                individuType: 'personneACharge',
                modalTitle: 'Personne à charge',
                askFirstName: true,
                maxAge: 25
            });
        }
    };
});
