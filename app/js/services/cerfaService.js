'use strict';

angular.module('ddsApp').factory('CerfaService', function(cerfaForms, SituationService, IndividuService) {
    // callbacks qui déterminent si un formulaire doit être proposé au téléchargement ou non en fonction de la situation
    var showableCerfaCallbacks = {
        'cmuc_choix_organisme_non_demandeur': function(situation) {
            var individus = SituationService.createIndividusList(situation);
            return 1 < individus.length;
        },
        'rsa_non_salarie': function(situation) {
            var nonSalarie = _.find(situation.demandeur.situationsPro, {situation: 'independant'});
            return !!nonSalarie;
        },
        'rsa_moins_25': function(situation) {
            var result = 25 > IndividuService.age(situation.demandeur);
            if (situation.conjoint) {
                result = result || 25 > IndividuService.age(situation.conjoint);
            }

            return result;
        },
        'caf_attestation_pret': function(situation) {
            return 'proprietaire' === situation.logement.type;
        },
        'caf_attestation_loyer': function(situation) {
            return 'locataire' === situation.logement.type;
        },
        'caf_attestation_residence_foyer': function() {
            return false; // Non géré pour l'instant car on ne capture pas le fait que le demandeur est rattaché à un organisme
        }
    };

    // callbacks qui déterminent si une pièce justificative est nécessaire ou non pour un individu ou une situation
    var requiredPiecesJustificativesCallbacks = {
        'identite': function(individu) {
            return 'autre' !== individu.nationalite && 18 <= IndividuService.age(individu);
        },
        'ofii': function(individu) {
            var result = _.contains(['enfant', 'personneACharge'], individu.role);
            result = result && 18 > IndividuService.age(individu);
            result = result && 'fr' !== individu.nationalite;
            result = result && 'France' !== individu.paysNaissance;

            return result;
        },
        'titre_sejour': function(individu) {
            if ('autre' !== individu.nationalite) {
                return false;
            }

            if (_.contains(['enfant', 'personneACharge'], individu.role)) {
                return 18 <= IndividuService.age(individu);
            }

            return true;
        },
        'imposition': function(individu) {
            return 16 <= IndividuService.age(individu);
        },
        'declaration_grossesse': function(situation) {
            return situation.demandeur.enceinte;
        },
        'cmu_c.vitale': function(individu) {
            return 18 <= IndividuService.age(individu);
        },
        'cmu_c.regularite': function(individu) {
            if ('demandeur' !== individu.role) {
                return 'fr' !== individu.nationalite;
            }

            return false;
        },
        'cmu_c.livret_famille': function(situation) {
            return !!situation.enfants.length || !!situation.personnesACharge.length;
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
                return _.contains(['fr', 'ue'], individu.nationalite);
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
        'rsa.avis_paiement_pension_invalidite': function(individu) {
            if (_.contains(['demandeur', 'conjoint'], individu.role)) {
                return !!_.find(individu.ressources, {type: 'pensionsInvalidite'});
            }

            return false;
        },
        'rsa.avis_paiement_retraite': function(individu) {
            if (_.contains(['demandeur', 'conjoint'], individu.role)) {
                return !!_.find(individu.situationsPro, {situation: 'retraite'});
            }

            return false;
        },
        'rsa.avis_paiement_rente_accident_travail': function(individu) {
            if (_.contains(['demandeur', 'conjoint'], individu.role)) {
                return !!_.find(individu.ressources, {type: 'indJourAccidentDuTravail'});
            }

            return false;
        },
        'rsa.declaration_revenus_saisonnier': function(individu) {
            if (_.contains(['demandeur', 'conjoint'], individu.role)) {
                return !!_.find(individu.situationsPro, {situation: 'travailleur_saisonnier'});
            }

            return false;
        },
        'aspa.imposition': function(individu) {
            if ('demandeur' === individu.role) {
                return true;
            } else if ('conjoint' === individu.role) {
                return 'relation_libre' === individu.relationType;
            }

            return false;
        },
        'aspa.titre_sejour': function(individu) {
            if (_.contains(['demandeur', 'conjoint'], individu.role)) {
                return 'autre' === individu.nationalite;
            }

            return false;
        }
    };

    var getEquivalentDroitId = function(droitId) {
        if ('acs' === droitId) {
            return'cmu_c';
        }

        if (_.contains(['als', 'alf', 'apl'], droitId)) {
            return 'al';
        }

        return droitId;
    };

    return {
        getCerfaFromDroit: function(droitId) {
            return _.find(cerfaForms, {droitId: getEquivalentDroitId(droitId)});
        },

        getCerfaFormsFromDroit: function(droitId, situation) {
            var cerfa = this.getCerfaFromDroit(droitId);
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
            var equivalentDroitId = getEquivalentDroitId(droitId);

            return _.filter(individus, function(individu) {
                var callback = requiredPiecesJustificativesCallbacks[equivalentDroitId + '.' + pieceId];
                if (!callback) {
                    callback = requiredPiecesJustificativesCallbacks[pieceId];
                }
                if (callback) {
                    return callback(individu);
                }

                return true;
            });
        },

        isPieceJustificativeRequiredForSituation: function(droitId, pieceId, situation) {
            var equivalentDroitId = getEquivalentDroitId(droitId);
            var callback = requiredPiecesJustificativesCallbacks[equivalentDroitId + '.' + pieceId];
            if (!callback) {
                callback = requiredPiecesJustificativesCallbacks[pieceId];
            }
            if (callback) {
                return callback(situation);
            }

            return true;
        }
    };
});
