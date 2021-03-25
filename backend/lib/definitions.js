var _ = require('lodash');
var ressources = require('../../app/js/constants/ressources');

var famille = {
    en_couple: Boolean,
    parisien: Boolean,
    proprietaire_proche_famille: Boolean,
    rsa_isolement_recent: Boolean,
    bourse_criteres_sociaux_nombre_enfants_a_charge: Number,
    bourse_criteres_sociaux_nombre_enfants_a_charge_dans_enseignement_superieur: Number,
};

var foyerFiscal = {
    rfr: Object,
    bourse_criteres_sociaux_nombre_enfants_a_charge: Number,
    bourse_criteres_sociaux_nombre_enfants_a_charge_dans_enseignement_superieur: Number,
};

var allRessources = _.concat(
    ressources.ressourceTypes,
    ressources.categoriesRnc,
    ressources.patrimoineTypes)
    .reduce(function(result, ressource) {
        result[ressource.id] = Object;
        return result;
    }, {});

var statutMaritalValues = [
    'marie',
    'pacse',
    'celibataire',
];

var individu = Object.assign({
    _id: false,
    id: String,
    aah_restriction_substantielle_durable_acces_emploi: Boolean,
    activite: { type: String, enum: ['actif', 'chomeur', 'etudiant', 'inactif', 'retraite'] },
    agepi_temps_travail_semaine: Number,
    ass_precondition_remplie: Boolean,
    boursier: Boolean,
    bourse_criteres_sociaux_base_ressource: Number,
    bourse_criteres_sociaux_commune_domicile_familial: String,
    _bourseCriteresSociauxCommuneDomicileFamilialCodePostal: String,
    _bourseCriteresSociauxCommuneDomicileFamilialNomCommune: String,
    date_arret_de_travail: Date,
    date_debut_chomage: Date,
    date_naissance: Date,
    duree_possession_titre_sejour: Number,
    echelon_bourse: Number,
    enceinte: Boolean,
    enfant_a_charge: Object,
    enfant_place: Boolean,
    _firstName: String,
    _interetPermisDeConduire: Boolean,
    garde_alternee: Boolean,
    gir: { type: String, default: 'non_defini' },
    habite_chez_parents: Boolean,
    handicap: Boolean,
    _hasRessources: Boolean,
    inapte_travail: Boolean,
    nationalite: { type: String },
    _role: { type: String, enum: ['demandeur', 'conjoint', 'enfant'] },
    scolarite: { type: String, enum: ['inconnue', 'college', 'lycee'] },
    statut_marital: { type: String, enum: statutMaritalValues },
    taux_incapacite: Number,
    tns_auto_entrepreneur_type_activite: { type: String, enum: ['achat_revente', 'bic', 'bnc'] },
    tns_autres_revenus_type_activite: { type: String, enum: ['achat_revente', 'bic', 'bnc'] },
    tns_micro_entreprise_type_activite: { type: String, enum: ['achat_revente', 'bic', 'bnc'] },
}, allRessources);

var statutOccupationLogementValues = [
    'primo_accedant',
    'proprietaire',
    'locataire_vide',
    'locataire_meuble',
    'loge_gratuitement',
    'locataire_foyer',
    'sans_domicile',
];

var menage = {
    aide_logement_date_pret_conventionne: String,
    charges_locatives: Number,
    _codePostal: String,
    coloc: Boolean,
    depcom: String,
    logement_chambre: Boolean,
    loyer: Number,
    _nomCommune: String,
    participation_frais: Boolean,
    statut_occupation_logement: { type: String, enum: statutOccupationLogementValues },
};

var situation = {
    createdAt: { type: Date, default: Date.now },
    dateDeValeur: Date,
    external_id: String,
    famille: famille,
    foyer_fiscal: foyerFiscal,
    demandeur: individu,
    conjoint: { type: individu, default: null },
    enfants: [individu],
    menage: menage,
    modifiedFrom: String,
    status: { type: String, default: 'new', enum: ['new', 'test', 'investigation'] },
    token: String,
    version: Number,
};

module.exports = {
  famille,
  foyerFiscal,
  individu,
  menage,
  situation
};
