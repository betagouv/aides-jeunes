var moment = require('moment');
var _ = require('lodash');

function formatDate(date) {
    return moment(date).format('YYYY-MM-DD');
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

module.exports = {
    individu: individuSchema,
    forDuplication: {
        familles: familleProperties,
        individus: individuProperties,
        menages: menageProperties,
    },
};
