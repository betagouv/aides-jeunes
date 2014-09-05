'use strict';

angular.module('ddsApp').factory('CerfaService', function(cerfaForms, SituationService, IndividuService) {
    var showableCerfaCallbacks = {
        'cmuc_choix_organisme_non_demandeur': function(situation) {
            var individus = SituationService.createIndividusList(situation);
            return 1 < individus.length;
        }
    };

    var requiredPiecesJustificativesCallbacks = {
        'cmu_c.vitale': function(individu) {
            return 'demandeur' === individu.role;
        },
        'cmu_c.identite': function(individu) {
            if ('demandeur' !== individu.role) {
                return _.contains(['fr', 'ue', individu]);
            }

            return false;
        },
        'cmu_c.regularite': function(individu) {
            if ('demandeur' !== individu.role) {
                return _.contains(['ue', 'autre', individu]);
            }

            return false;
        },
        'cmu_c.ressources': function(individu) {
            return 16 < IndividuService.age(individu)
        },
        'rsa.identite': function(individu) {
            if (_.contains(['demandeur', 'conjoint'], individu.role)) {
                return 'fr' === individu.nationalite;
            }

            return 'France' === individu.paysNaissance;
        }
    };

    return {
        getCerfaFormsFromDroit: function(droitId, situation) {
            var cerfa = _.find(cerfaForms, { droitId: droitId });
            var result = [];

            if (cerfa) {
                cerfa.forms.forEach(function(form) {
                    var showCerfaCallback = showableCerfaCallbacks[form.id];
                    if (showCerfaCallback) {
                        if (!showCerfaCallback(situation)) {
                            return;
                        }
                    }

                    result.push(form);
                });
            }

            return result;
        },

        pieceJustificativeRequiredForIndividu: function(droitId, pieceId, individu) {
            var callback = requiredPiecesJustificativesCallbacks[droitId + '.' + pieceId];
            if (callback) {
                return callback(individu);
            }

            return true;
        }
    };
});
