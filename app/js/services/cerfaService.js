'use strict';

angular.module('ddsApp').factory('CerfaService', function (cerfaForms, piecesJustificatives, SituationService, IndividuService) {
    // callbacks qui déterminent si un formulaire doit être proposé au téléchargement ou non en fonction de la situation
    var showableCerfaCallbacks = {
        'rsa_non_salarie': function (situation) {
            var demandeur = SituationService.getDemandeur(situation);
            return demandeur.ressources && demandeur.ressources.some(function(ressource) {
                return ['caMicroEntreprise', 'caAutoEntrepreneur', 'revenusAgricolesTns', 'autresRevenusTns', 'caAutresRevenusTns'].indexOf(ressource.type) >= 0;
            });
        },
        'rsa_moins_25': function (situation) {
            var demandeur = SituationService.getDemandeur(situation),
                conjoint = SituationService.getConjoint(situation);
            return IndividuService.age(demandeur) < 25 || (conjoint && IndividuService.age(conjoint) < 25);
        }
    };

    // callbacks qui déterminent si une pièce justificative est nécessaire ou non pour un individu ou une situation
    var requiredPiecesJustificativesCallbacks = {
        'identite': function (individu) {
            return individu.nationalite != 'autre' && IndividuService.age(individu) >= 18;
        },
        'titre_sejour': function (individu) {
            return individu.nationalite == 'autre' && (individu.role != 'enfant' || IndividuService.age(individu) >= 18);
        },
        'imposition': function (individu) {
            return IndividuService.age(individu) >= 16;
        },
        'declaration_grossesse': function (situation) {
            return situation.individus.some(function (individu) {
                return individu.enceinte;
            });
        },
        'attestation_chomage_partiel': function (individu) {
            return individu.ressources && individu.ressources.some(function (ressource) {
                return ressource.type == 'indChomagePartiel';
            });
        },
        'cmu_c.vitale': function (individu) {
            return IndividuService.age(individu) >= 18;
        },
        'cmu_c.regularite': function (individu) {
            return individu.role != 'demandeur' && individu.nationalite != 'fr';
        },
        'cmu_c.livret_famille': function (situation) {
            return situation.individus.some(function (individu) {
                return individu.role == 'enfant';
            });
        },
        'cmu_c.bulletins_paie': function (individu) {
            return IndividuService.age(individu) >= 16 && individu.ressources && individu.ressources.some(function (ressource) {
                return ressource.type == 'revenusSalarie';
            });
        },
        'cmu_c.attestation_indemnites_chomage': function (individu) {
            return IndividuService.age(individu) >= 16 && individu.ressources && individu.ressources.some(function (ressource) {
                return ressource.type == 'allocationsChomage' || ressource.type == 'indChomagePartiel';
            });
        },
        'cmu_c.taxe_fonciere': function (situation) {
            return situation.logement.type == 'proprietaire';
        },
        'cmu_c.taxe_habitation': function (situation) {
            return _.contains(['locataire', 'colocataire'], situation.logement.type);
        },
        'rsa.identite': function (individu) {
            return _.contains(['fr', 'ue'], individu.nationalite);
        },
        'rsa.avis_paiement_pension_invalidite': function (individu) {
            return IndividuService.isParent(individu) && _.find(individu.ressources, {type: 'pensionsInvalidite'});
        },
        'rsa.avis_paiement_retraite': function (individu) {
            return IndividuService.isParent(individu) && _.find(individu.situationsPro, {situation: 'retraite'});
        },
        'rsa.avis_paiement_rente_accident_travail': function (individu) {
                return IndividuService.isParent(individu) && _.find(individu.ressources, {type: 'indJourAccidentDuTravail'});
        },
        'rsa.taxe_habitation_patrimoine': function (situation) {
            return situation.patrimoine.valeurLocativeImmoNonLoue > 0 || situation.patrimoine.valeurLocativeTerrainNonLoue > 0;
        },
        'aspa.imposition': function (individu) {
            return individu.role == 'demandeur' || (individu.role == 'conjoint' && individu.statutMarital == 'union_libre');
        },
        'aspa.titre_sejour': function (individu) {
            return IndividuService.isParent(individu) && individu.nationalite == 'autre';
        }
    };

    return {
        getCerfaFormsFromDroit: function (droitId, situation) {
            return _.filter(cerfaForms[droitId].forms, function(form, id) {
                return ! showableCerfaCallbacks[id] || showableCerfaCallbacks[id](situation);
            });
        },

        pieceJustificativeIndividus: function (droitId, pieceId, individus) {
            return _.filter(individus, function (individu) {
                var callback = requiredPiecesJustificativesCallbacks[droitId + '.' + pieceId];
                if (! callback) {
                    callback = requiredPiecesJustificativesCallbacks[pieceId];
                }
                if (callback) {
                    return callback(individu);
                }

                return true;
            });
        },

        isPieceJustificativeRequiredForSituation: function (droitId, pieceId, situation) {
            var callback = requiredPiecesJustificativesCallbacks[droitId + '.' + pieceId];
            if (! callback) {
                callback = requiredPiecesJustificativesCallbacks[pieceId];
            }
            if (callback) {
                return callback(situation);
            }

            return true;
        },

        getRequiredPiecesJustificatives: function (cerfa, droit, situation) {
            var result = [];
            var that = this;
            cerfa.piecesJustificatives.forEach(function (pieceId) {
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
