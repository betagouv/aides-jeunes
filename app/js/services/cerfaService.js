'use strict';

angular.module('ddsApp').factory('CerfaService', function(cerfaForms, SituationService) {
    var showableCerfaCallbacks = {
        'cmuc_choix_organisme_non_demandeur': function(situation) {
            var individus = SituationService.createIndividusList(situation);
            return 1 < individus.length;
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
        }
    };
});
