var mongoose = require('mongoose');
var _ = require('lodash');
var ressources = require('../../app/js/constants/ressources');

var familleDef = {
    parisien: Boolean,
    proprietaire_proche_famille: Boolean,
    rsa_isolement_recent: Boolean,
};

var foyerFiscalDef = {
    rfr: Object,
};

var ressourcesDefs = _.concat(
    ressources.ressourceTypes,
    ressources.categoriesRnc,
    ressources.patrimoineTypes)
.reduce(function(result, ressource) {
    result[ressource.id] = Object;
    return result;
}, {});

var specificSituationValues = [
    'demandeur_emploi',
    'etudiant',
    'retraite',
    'handicap',
    'boursier',
    'inapte_travail',
    'autre'
];

var statutMaritalValues = [
    'Marié',
    'Pacsé',
    'Célibataire',
];

var individuDef = Object.assign({
    _id: false,
    id: String,
    ass_precondition_remplie: Boolean,
    boursier: Boolean,
    date_arret_de_travail: Date,
    date_naissance: Date,
    echelon_bourse: Number,
    enfant_a_charge: Object,
    enfant_place: Boolean,
    enceinte: Boolean,
    firstName: String,
    garde_alternee: Boolean,
    habite_chez_parents: Boolean,
    nationalite: { type: String, enum: ['fr', 'ue', 'autre'] },
    perte_autonomie: Boolean,
    role: { type: String, enum: ['demandeur', 'conjoint', 'enfant'] },
    scolarite: { type: String, enum: ['Inconnue', 'Collège', 'Lycée'] },
    specificSituations: [{ type: String, enum: specificSituationValues }],
    statut_marital: { type: String, enum: statutMaritalValues },
    taux_incapacite: Number,
    tns_auto_entrepreneur_type_activite: { type: String, enum: ['achat_revente', 'bic', 'bnc'] },
    tns_autres_revenus_type_activite: { type: String, enum: ['achat_revente', 'bic', 'bnc'] },
    tns_micro_entreprise_type_activite: { type: String, enum: ['achat_revente', 'bic', 'bnc'] },
}, ressourcesDefs);

var statutOccupationLogementValues = [
    'Accédant à la propriété',
    'Propriétaire (non accédant) du logement',
    'Locataire ou sous-locataire d‘un logement loué vide non-HLM',
    'Locataire ou sous-locataire d‘un logement loué meublé ou d‘une chambre d‘hôtel',
    'Logé gratuitement par des parents, des amis ou l‘employeur',
    'Locataire d‘un foyer (résidence universitaire, maison de retraite, foyer de jeune travailleur, résidence sociale...)',
    'Sans domicile stable',
];

var menageDef = {
    charges_locatives: Number,
    code_postal: String,
    coloc: Boolean,
    depcom: String,
    logement_chambre: Boolean,
    loyer: Number,
    nom_commune: String,
    participation_frais: Boolean,
    statut_occupation_logement: { type: String, enum: statutOccupationLogementValues },
};

var situationSchema = {
    dateDeValeur: Date,
    famille: familleDef,
    foyer_fiscal: foyerFiscalDef,
    individus: [individuDef],
    menage: menageDef,
};

mongoose.model('Situation', new mongoose.Schema(situationSchema, { minimize: false }));
mongoose.model('LegacySituation', new mongoose.Schema({}, { strict: false }));

