var _ = require('lodash');
var common = require('./common');

var familleProperties = [
    'parisien',
    'proprietaire_proche_famille',
    'rsa_isolement_recent',
];

var individuProperties = [
    'aah_restriction_substantielle_durable_acces_emploi',
    'activite',
    'age',
    'age_en_mois',
    'ass_precondition_remplie',
    'boursier',
    'date_arret_de_travail',
    'date_debut_chomage',
    'date_naissance',
    'duree_possession_titre_sejour',
    'echelon_bourse',
    'enceinte',
    'enfant_place',
    'etudiant',
    'garde_alternee',
    'gir',
    'habite_chez_parents',
    'handicap',
    'inapte_travail',
    'nationalite',
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
    'aide_logement_date_pret_conventionne',
];

function copyTo3PreviousMonths(testCase, dateDeValeur) {
    var periodKeys = ['thisMonth', '1MonthsAgo', '2MonthsAgo', '3MonthsAgo'];
    var periods = common.getPeriods(dateDeValeur);

    var forDuplication = {
        familles: familleProperties,
        individus: individuProperties,
        menages: menageProperties,
    };
    Object.keys(forDuplication).forEach(function(entityName) {
        forDuplication[entityName].forEach(function(entityPropertyName) {
            _.forEach(testCase[entityName], function(entity) {
                var value = entity[entityPropertyName];
                var result = {};
                if (value !== undefined) {
                    periodKeys.forEach(function(periodKey) {
                        result[periods[periodKey]] = value;
                    });
                    entity[entityPropertyName] = result;
                }
            });
        });
    });
}

module.exports = copyTo3PreviousMonths;
