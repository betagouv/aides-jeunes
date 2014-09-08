'use strict';

angular.module('ddsApp').factory('CerfaService', function(cerfaForms, SituationService, IndividuService) {
    // callbacks qui déterminent si un formulaire doit être proposé au téléchargement ou non en fonction de la situation
    var showableCerfaCallbacks = {
        'cmuc_choix_organisme_non_demandeur': function(situation) {
            var individus = SituationService.createIndividusList(situation);
            return 1 < individus.length;
        }
    };

    // callbacks qui déterminent si une pièce justificative est nécessaire ou non pour un individu ou une situation
    var requiredPiecesJustificativesCallbacks = {
        'cmu_c.identite': function(individu) {
            if ('demandeur' !== individu.role) {
                return 'autre' !== individu.nationalite;
            }

            return false;
        },
        'cmu_c.regularite': function(individu) {
            if ('demandeur' !== individu.role) {
                return 'fr' !== individu.nationalite;
            }

            return false;
        },
        'cmu_c.famille': function(situation) {
            return !!situation.enfants.length || !!situation.personnesACharge.length;
        },
        'cmu_c.imposition': function(individu) {
            return 16 <= IndividuService.age(individu);
        },
        'cmu_c.bulletins_paie': function(individu) {
            if (16 > IndividuService.age(individu)) {
                return false;
            }

            return !!_.where(individu.ressources, {type: 'revenusSalarie'}).length;
        },
        'cmu_c.attestation_indemnites_chomage': function(individu) {
            if (16 > IndividuService.age(individu)) {
                return false;
            }

            var nbRessourcesChomage = _.where(individu.ressources, {type: 'allocationsChomage'}).length;
            nbRessourcesChomage += _.where(individu.ressources, {type: 'indChomagePartiel'}).length;

            return !!nbRessourcesChomage;
        },
        'cmu_c.taxe_fonciere': function(situation) {
            return 'proprietaire' === situation.logement.type;
        },
        'cmu_c.taxe_habitation': function(situation) {
            return _.contains(['locataire', 'colocataire'], situation.logement.type);
        },
        'rsa.identite': function(individu) {
            if (_.contains(['demandeur', 'conjoint'], individu.role)) {
                return 'fr' === individu.nationalite;
            }

            return 'France' === individu.paysNaissance;
        },
        'rsa.acte_naissance': function(individu) {
            var result = _.contains(['enfant', 'personneACharge'], individu.role);
            result = result && 18 > IndividuService.age(individu);
            result = result && 'fr' !== individu.nationalite;
            result = result && 'France' === individu.paysNaissance;

            return result;
        },
        'rsa.ofii': function(individu) {
            var result = _.contains(['enfant', 'personneACharge'], individu.role);
            result = result && 18 > IndividuService.age(individu);
            result = result && 'fr' !== individu.nationalite;
            result = result && 'France' !== individu.paysNaissance;

            return result;
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

        pieceJustificativeIndividus: function(droitId, pieceId, individus) {
            return _.filter(individus, function(individu) {
                var callback = requiredPiecesJustificativesCallbacks[droitId + '.' + pieceId];
                if (callback) {
                    return callback(individu);
                }

                return true;
            });
        },

        isPieceJustificativeRequiredForSituation: function(droitId, pieceId, situation) {
            var callback = requiredPiecesJustificativesCallbacks[droitId + '.' + pieceId];
            if (callback) {
                return callback(situation);
            }

            return true;
        }
    };
});
