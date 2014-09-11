'use strict';

angular.module('ddsApp').factory('IndividuModalService', function($modal, SituationService) {
    var open = function(options) {
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
    };

    return {
        openDemandeur: function() {
            return this.open({
                individuType: 'demandeur',
                modalTitle: 'Vous',
                cancelable: false,
                checkResidenceStability: true,
                minAge: 12
            });
        },

        openConjoint: function() {
            var situation = SituationService.restoreLocal();
            return this.open({
                individuType: 'conjoint',
                modalTitle: 'Votre conjoint',
                askRelationType: true,
                checkResidenceStability: true,
                minAge: 12
            }).then(function() {}, function() {
                situation.livesAlone = undefined;
            });
        },

        openEnfant: function() {
            return this.open({
                individuType: 'enfant',
                modalTitle: 'Votre enfant',
                askFirstName: true,
                maxAge: 25
            });
        },

        openPersonneACharge: function() {
            return this.open({
                individuType: 'personneACharge',
                modalTitle: 'Personne à charge',
                askFirstName: true
            });
        }
    };
});
