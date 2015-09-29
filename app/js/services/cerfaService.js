'use strict';

angular.module('ddsApp').factory('CerfaService', function(cerfaForms, piecesJustificatives, SituationService, IndividuService) {
    // callbacks qui déterminent si un formulaire doit être proposé au téléchargement ou non en fonction de la situation
    var showableCerfaCallbacks = {
        'cmuc_choix_organisme_non_demandeur': function(situation) {
            return 1 < situation.individus.length;
        },
        'rsa_non_salarie': function(situation) {
            var demandeur = _.find(situation.individus, { role: 'demandeur' });
            var nonSalarie = _.find(demandeur.situationsPro, {situation: 'independant'});
            return !! nonSalarie;
        },
        'rsa_moins_25': function(situation) {
            var result = 25 > IndividuService.age(_.find(situation.individus, { role: 'demandeur' }));
            var conjoint = _.find(situation.individus, { role: 'conjoint' });
            if (conjoint) {
                result = result || 25 > IndividuService.age(conjoint);
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
            return _.every([
                individu.role == 'enfant',
                18 > IndividuService.age(individu),
                'fr' !== individu.nationalite,
                'France' !== individu.paysNaissance
            ]);
        },
        'titre_sejour': function(individu) {
            if ('autre' !== individu.nationalite) {
                return false;
            }

            if (individu.role == 'enfant') {
                return 18 <= IndividuService.age(individu);
            }

            return true;
        },
        'imposition': function(individu) {
            return 16 <= IndividuService.age(individu);
        },
        'declaration_grossesse': function(situation) {
            return !! _.filter(situation.individus, 'enceinte').length;
        },
        'attestation_chomage_partiel': function(individu) {
            var nbRessourcesChomage = _.where(individu.ressources, {type: 'indChomagePartiel'}).length;
            return !! nbRessourcesChomage;
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
            return !! _.where(situation.individus, { role: 'enfant'}).length;
        },
        'cmu_c.bulletins_paie': function(individu) {
            if (16 > IndividuService.age(individu)) {
                return false;
            }

            return !! _.where(individu.ressources, {type: 'revenusSalarie'}).length;
        },
        'cmu_c.attestation_indemnites_chomage': function(individu) {
            if (16 > IndividuService.age(individu)) {
                return false;
            }

            var nbRessourcesChomage = _.where(individu.ressources, {type: 'allocationsChomage'}).length;
            nbRessourcesChomage += _.where(individu.ressources, {type: 'indChomagePartiel'}).length;

            return !! nbRessourcesChomage;
        },
        'cmu_c.taxe_fonciere': function(situation) {
            return 'proprietaire' === situation.logement.type;
        },
        'cmu_c.taxe_habitation': function(situation) {
            return _.contains(['locataire', 'colocataire'], situation.logement.type);
        },
        'rsa.identite': function(individu) {
            if (IndividuService.isParent(individu)) {
                return _.contains(['fr', 'ue'], individu.nationalite);
            }

            return 'France' === individu.paysNaissance;
        },
        'rsa.acte_naissance': function(individu) {
            return _.every([
                individu.role == 'enfant',
                18 > IndividuService.age(individu),
                'fr' !== individu.nationalite,
                'France' === individu.paysNaissance
            ]);
        },
        'rsa.avis_paiement_pension_invalidite': function(individu) {
            if (IndividuService.isParent(individu)) {
                return !! _.find(individu.ressources, {type: 'pensionsInvalidite'});
            }

            return false;
        },
        'rsa.avis_paiement_retraite': function(individu) {
            if (IndividuService.isParent(individu)) {
                return !! _.find(individu.situationsPro, {situation: 'retraite'});
            }

            return false;
        },
        'rsa.avis_paiement_rente_accident_travail': function(individu) {
            if (IndividuService.isParent(individu)) {
                return !! _.find(individu.ressources, {type: 'indJourAccidentDuTravail'});
            }

            return false;
        },
        'rsa.declaration_revenus_saisonnier': function(individu) {
            if (IndividuService.isParent(individu)) {
                return !! _.find(individu.situationsPro, {situation: 'travailleur_saisonnier'});
            }

            return false;
        },
        'rsa.taxe_habitation_patrimoine': function(situation) {
            return 0 < situation.patrimoine.valeurLocativeImmoNonLoue || 0 < situation.patrimoine.valeurLocativeTerrainNonLoue;
        },
        'aspa.imposition': function(individu) {
            if ('demandeur' === individu.role) {
                return true;
            } else if ('conjoint' === individu.role) {
                return 'union_libre' === individu.statutMarital;
            }

            return false;
        },
        'aspa.titre_sejour': function(individu) {
            if (IndividuService.isParent(individu)) {
                return 'autre' === individu.nationalite;
            }

            return false;
        }
    };

    var getEquivalentDroitId = function(droitId) {
        if ('acs' === droitId) {
            return'cmu_c';
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
                        if (! showCerfaCallback(situation)) {
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
                if (! callback) {
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
            if (! callback) {
                callback = requiredPiecesJustificativesCallbacks[pieceId];
            }
            if (callback) {
                return callback(situation);
            }

            return true;
        },

        getRequiredPiecesJustificatives: function(cerfa, droit, situation) {
            var result = [];
            var that = this;
            cerfa.piecesJustificatives.forEach(function(pieceId) {
                var pieceJustificative = _.find(piecesJustificatives, {id: pieceId});
                var piece = { description: pieceJustificative };
                if (false !== pieceJustificative.isIndividualized) {
                    var individusConcernes = that.pieceJustificativeIndividus(droit, pieceJustificative.id, situation.individus);
                    if (! individusConcernes.length) {
                        return;
                    }

                    piece.individus = _.map(individusConcernes, IndividuService.label);
                } else {
                    if (! that.isPieceJustificativeRequiredForSituation(droit, pieceJustificative.id, situation)) {
                        return;
                    }
                }

                result.push(piece);
            });

            return result;
        }
    };
});
