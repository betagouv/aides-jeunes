'use strict';

function formatDate(date) {
    return moment(date).format('YYYY-MM-DD');
}

function isIndividuValid(individu, situation) {
    var age = moment(situation.dateDeValeur).diff(moment(individu.date_naissance), 'years');
    var handicap = individu.specificSituations.indexOf('handicap' ) >= 0;
    return individu.role != 'enfant' || age <= 25 || handicap;
}

function getEnfants(situation) {
    var enfants = _.filter(situation.individus, function(individu) {
        return isIndividuValid(individu, situation) && individu.role == 'enfant';
    });
    return _.map(enfants, 'id');
}

var individuSchema = {
    date_naissance: {
        src: 'date_naissance',
        fn: formatDate
    },
    age: {
        src: 'date_naissance',
        fn: function (dateDeNaissance, individu, situation) {
            return moment(situation.dateDeValeur).diff(moment(dateDeNaissance), 'years');
        }
    },
    age_en_mois: {
        src: 'date_naissance',
        fn: function (dateDeNaissance, individu, situation) {
            return moment(situation.dateDeValeur).diff(moment(dateDeNaissance), 'months');
        }
    },
    statut_marital: {
        src: 'statutMarital',
        values: {
            seul: 2,
            mariage: 1,
            pacs: 5,
            union_libre: 2
        }
    },
    id: {
        src: 'id',
        copyTo3PreviousMonths: false
    },
    enceinte: 'enceinte',
    date_arret_de_travail: {
        src: 'date_arret_de_travail',
        fn: formatDate
    },
    activite: {
        src: 'specificSituations',
        fn: function(value) {
            var returnValue;
            _.forEach({
                demandeur_emploi: 1,
                etudiant: 2,
                retraite: 3
            }, function(situationIndex, situation) {
                if (value.indexOf(situation) >= 0) {
                    returnValue = situationIndex;
                }
            });
            return returnValue;
        }
    },
    handicap: {
        src: 'specificSituations',
        fn: function(specificSituations) {
            return specificSituations.indexOf('handicap') >= 0;
        }
    },
    taux_incapacite: {
        fn: function(individu) {
            var handicap = individu.specificSituations.indexOf('handicap') >= 0;
            var tauxMap = {
                    moins50: 0.3,
                    moins80: 0.7,
                    plus80: 0.9
            };
            return handicap && tauxMap[individu.tauxIncapacite];
        }
    },
    inapte_travail: {
        src: 'specificSituations',
        fn: function(specificSituations) {
            return specificSituations.indexOf('inapte_travail') >= 0;
        }
    },
    perte_autonomie: 'perteAutonomie',
    etudiant: {
        src: 'specificSituations',
        fn: function(specificSituations) {
            return specificSituations.indexOf('etudiant') >= 0;
        }
    },
    scolarite: {
        fn: function(individu) {
            var values = {
                'inconnue': 0,
                'college': 1,
                'lycee': 2
            };
            return values[individu.scolarite];
        }
    },
    enfant_a_charge: {
        // variable liée à l'année fiscale : on la définit sur l'année
        fn: function(individu, situation) {
            var year = moment(situation.dateDeValeur).format('YYYY');
            var result = {};
            result[year] = individu.aCharge || (! individu.fiscalementIndependant);
            return result;
        },
        copyTo3PreviousMonths: false,
    },
    habite_chez_parents: 'habiteChezParents',

    /* Revenus du patrimoine */
    interets_epargne_sur_livrets: {
        src: 'epargneSurLivret',
        fn: function(value) {
            return {
                '2012-01': 0.01 * value || 0
            };
        },
        copyTo3PreviousMonths: false,
    },
    epargne_non_remuneree: {
        src: 'epargneSansRevenus',
        fn: function (value) {
            return {
                '2012-01': value || 0
            };
        },
        copyTo3PreviousMonths: false
    },
    valeur_locative_immo_non_loue: {
        src: 'valeurLocativeImmoNonLoue',
        fn: function (value) {
            return {
                '2012-01': value || 0
            };
        },
        copyTo3PreviousMonths: false,
    },
    valeur_locative_terrains_non_loue: {
        src: 'valeurLocativeTerrainNonLoue',
        fn: function (value) {
            return {
                '2012-01': value || 0
            };
        },
        copyTo3PreviousMonths: false,
    },

    /* Activités non-salarié */
    tns_autres_revenus_type_activite: 'tns_autres_revenus_type_activite',
    tns_auto_entrepreneur_type_activite: 'autoEntrepreneurActiviteType',
    tns_micro_entreprise_type_activite: 'microEntrepriseActiviteType',
};

var familleProperties = [
    'parisien',
    'proprietaire_proche_famille',
    'rsa_isolement_recent',
];

var individuProperties = [
    'activite',
    'age',
    'age_en_mois',
    'ass_precondition_remplie',
    'boursier',
    'date_arret_de_travail',
    'date_naissance',
    'echelon_bourse',
    'enceinte',
    'enfant_place',
    'etudiant',
    'garde_alternee',
    'habite_chez_parents',
    'handicap',
    'inapte_travail',
    'perte_autonomie',
    'scolarite',
    'statut_marital',
    'taux_incapacite',
    'tns_auto_entrepreneur_type_activite',
    'tns_autres_revenus_type_activite',
    'tns_micro_entreprise_type_activite',
];

var menageProperties = [
    'charges_locatives',
    'coloc',
    'depcom',
    'logement_chambre',
    'loyer',
    'participation_frais',
    'statut_occupation_logement',
];

angular.module('ddsCommon').constant('mappingSchemas', {
    isIndividuValid: isIndividuValid,
    individu: individuSchema,
    forDuplication: {
        familles: familleProperties,
        individus: individuProperties,
        menages: menageProperties,
    },
});
