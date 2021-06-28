var concat = require("lodash/concat")

var ressources = require("../../src/constants/resources")

var famille = {
  en_couple: Boolean,
  parisien: Boolean,
  proprietaire_proche_famille: Boolean,
  rsa_isolement_recent: Boolean,
  bourse_criteres_sociaux_nombre_enfants_a_charge: Number,
  bourse_criteres_sociaux_nombre_enfants_a_charge_dans_enseignement_superieur:
    Number,
}

var foyerFiscal = {
  rfr: Object,
}

var allRessources = concat(
  ressources.ressourceTypes,
  ressources.categoriesRnc,
  ressources.patrimoineTypes
).reduce(function (result, ressource) {
  result[ressource.id] = Object
  return result
}, {})

var individu = Object.assign(
  {
    _id: false,
    id: String,
    aah_restriction_substantielle_durable_acces_emploi: Boolean,
    activite: {
      type: String,
      enum: ["actif", "chomeur", "etudiant", "inactif", "retraite"],
    },
    agepi_temps_travail_semaine: Number,
    _aide_jeunes_diplomes_anciens_boursiers_base_ressources: Boolean,
    aide_jeunes_diplomes_anciens_boursiers_base_ressources: Number,
    aide_mobilite_master_sortie_region_academique: Boolean,
    aide_mobilite_parcoursup_boursier_lycee: Boolean,
    aide_mobilite_parcoursup_sortie_academie: Boolean,
    alternant: Boolean,
    ass_precondition_remplie: Boolean,
    boursier: Boolean,
    bourse_criteres_sociaux_base_ressources_parentale: Number,
    bourse_criteres_sociaux_echelon: Number,
    _bourseCriteresSociauxCommuneDomicileFamilial: String,
    _bourseCriteresSociauxCommuneDomicileFamilialCodePostal: String,
    _bourseCriteresSociauxCommuneDomicileFamilialNomCommune: String,
    _chomage_brut: Boolean,
    classe_scolarite: {
      type: String,
      enum: ["autre", "terminale", "licence_3", "master_1"],
    },
    date_arret_de_travail: Date,
    date_debut_chomage: Date,
    date_naissance: Date,
    _diplome_2020_2021: Boolean,
    _dureeMoisEtudesEtranger: Number,
    duree_possession_titre_sejour: Number,
    enceinte: Boolean,
    enfant_a_charge: Object,
    enfant_place: Boolean,
    _firstName: String,
    _interetEtudesEtranger: Boolean,
    _interetPermisDeConduire: Boolean,
    garde_alternee: Boolean,
    gir: String,
    habite_chez_parents: Boolean,
    handicap: Boolean,
    _hasRessources: Boolean,
    inapte_travail: Boolean,
    nationalite: { type: String },
    _plus_haut_diplome_niveau_2020_2021: {
      type: String,
      enum: [
        "non_renseigne",
        "niveau_1",
        "niveau_2",
        "niveau_3",
        "niveau_4",
        "niveau_5",
        "niveau_6",
        "niveau_7",
        "niveau_8",
      ],
    },
    _role: { type: String, enum: ["demandeur", "conjoint", "enfant"] },
    rsa_jeune_condition_heures_travail_remplie: Boolean,
    scolarite: {
      type: String,
      enum: [
        "college",
        "lycee",
        "enseignement_superieur",
        "grande_ecole_du_numerique",
        "inconnue",
      ],
    },
    statuts_etablissement_scolaire: {
      type: String,
      enum: ["inconnu", "public", "prive_sous_contrat", "prive_hors_contrat"],
    },
    statut_marital: { type: String, enum: statutMaritalValues },
    taux_incapacite: Number,
    tns_auto_entrepreneur_type_activite: {
      type: String,
      enum: ["achat_revente", "bic", "bnc"],
    },
    tns_autres_revenus_type_activite: {
      type: String,
      enum: ["achat_revente", "bic", "bnc"],
    },
    tns_micro_entreprise_type_activite: {
      type: String,
      enum: ["achat_revente", "bic", "bnc"],
    },
  },
  allRessources
)

var statutMaritalValues = ["marie", "pacse", "celibataire"]

var statutOccupationLogementValues = [
  "primo_accedant",
  "proprietaire",
  "locataire_vide",
  "locataire_meuble",
  "loge_gratuitement",
  "locataire_foyer",
  "sans_domicile",
]

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
  statut_occupation_logement: {
    type: String,
    enum: statutOccupationLogementValues,
  },
}

var parents = {
  _situation: {
    type: String,
    enum: ["en_couple", "separes", "decedes", "sans_autorite", "veuve"],
  },
  _en_france: Boolean,
}

var situation = {
  abtesting: Object,
  createdAt: { type: Date, default: Date.now },
  dateDeValeur: Date,
  external_id: String,
  famille,
  foyer_fiscal: foyerFiscal,
  demandeur: individu,
  conjoint: { type: individu, default: null },
  enfants: [individu],
  menage,
  parents,
  modifiedFrom: String,
  status: {
    type: String,
    default: "new",
    enum: ["new", "test", "investigation"],
  },
  token: String,
  version: Number,
}

module.exports = {
  famille,
  foyerFiscal,
  individu,
  menage,
  situation,
}
