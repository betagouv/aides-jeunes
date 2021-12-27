const concat = require("lodash/concat")

const ressources = require("../../lib/Resources")

const famille = {
  bourse_lycee: Boolean,
  en_couple: Boolean,
  parisien: Boolean,
  proprietaire_proche_famille: Boolean,
  rsa_isolement_recent: Boolean,
  bourse_criteres_sociaux_nombre_enfants_a_charge: Number,
  bourse_criteres_sociaux_nombre_enfants_a_charge_dans_enseignement_superieur:
    Number,
}

const foyerFiscal = {
  rfr: Object,
}

const allRessources = concat(
  ressources.ressourceTypes,
  ressources.categoriesRnc,
  ressources.patrimoineTypes
).reduce(function (result, ressource) {
  result[ressource.id] = Object
  return result
}, {})

const statutMaritalValues = ["marie", "pacse", "celibataire"]

const individu = Object.assign(
  {
    _id: false,
    id: String,
    aah_restriction_substantielle_durable_acces_emploi: Boolean,
    activite: {
      type: String,
      enum: [
        "salarie",
        "independant",
        "chomeur",
        "etudiant",
        "inactif",
        "retraite",
        "service_civique",
      ],
    },
    agepi_temps_travail_semaine: Number,
    aide_jeunes_diplomes_anciens_boursiers_base_ressources: Number,
    alternant: Boolean,
    annee_etude: {
      type: String,
      enum: [
        "seconde",
        "premiere",
        "terminale",
        "bts_1",
        "but_1",
        "cpge_1",
        "licence_1",
        "licence_2",
        "licence_3",
        "master_1",
        "master_2",
        "doctorat_1",
        "doctorat_2",
        "doctorat_3",
        "autre",
      ],
    },
    ass_precondition_remplie: Boolean,
    boursier: Boolean,
    _boursier_derniere_annee_etudes: Boolean,
    bourse_criteres_sociaux_base_ressources_parentale: Number,
    bourse_criteres_sociaux_echelon: Number,
    _bourseCriteresSociauxCommuneDomicileFamilial: String,
    _bourseCriteresSociauxCommuneDomicileFamilialCodePostal: String,
    _bourseCriteresSociauxCommuneDomicileFamilialDepartement: String,
    _bourseCriteresSociauxCommuneDomicileFamilialEpci: String,
    _bourseCriteresSociauxCommuneDomicileFamilialEpciType: String,
    _bourseCriteresSociauxCommuneDomicileFamilialNomCommune: String,
    _bourseCriteresSociauxCommuneDomicileFamilialRegion: String,
    categorie_salarie: {
      type: String,
      enum: ["public_non_titulaire", "prive_non_cadre"],
    },
    _continuite_etudes: Boolean,
    _contrat_alternant: {
      type: String,
      enum: ["apprenti", "professionnalisation"],
    },
    date_arret_de_travail: Date,
    date_debut_chomage: Date,
    date_naissance: Date,
    _dureeMoisEtudesEtranger: Number,
    duree_possession_titre_sejour: Number,
    enceinte: Boolean,
    enfant_a_charge: Object,
    enfant_place: Boolean,
    _firstName: String,
    _interetBafa: Boolean,
    _interetEtudesEtranger: Boolean,
    _interetPermisDeConduire: Boolean,
    garde_alternee: Boolean,
    gir: String,
    habite_chez_parents: Boolean,
    handicap: Boolean,
    _hasRessources: Boolean,
    inapte_travail: Boolean,
    mention_baccalaureat: {
      type: String,
      enum: [
        "non_renseignee",
        "mention_assez_bien",
        "mention_bien",
        "mention_tres_bien",
        "mention_tres_bien_felicitations_jury",
      ],
    },
    nationalite: { type: String },
    _nombreMoisDebutContratDeTravail: {
      type: Number,
      enum: [2, 5, 12],
    },
    plus_haut_diplome_date_obtention: Date,
    plus_haut_diplome_niveau: {
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
    regime_securite_sociale: {
      type: String,
      enum: ["regime_general", "regime_agricole", "autres_regimes", "inconnu"],
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
    sortie_academie: Boolean,
    sortie_region_academique: Boolean,
    stagiaire: Boolean,
    statuts_etablissement_scolaire: {
      type: String,
      enum: ["inconnu", "public", "prive_sous_contrat", "prive_hors_contrat"],
    },
    statut_marital: { type: String, enum: statutMaritalValues },
    taux_incapacite: Number,
    tns_autres_revenus_type_activite: {
      type: String,
      enum: ["achat_revente", "bic", "bnc"],
    },
  },
  allRessources
)

const statutOccupationLogementValues = [
  "primo_accedant",
  "proprietaire",
  "locataire_vide",
  "locataire_meuble",
  "loge_gratuitement",
  "locataire_foyer",
  "sans_domicile",
]

const menage = {
  aide_logement_date_pret_conventionne: String,
  charges_locatives: Number,
  _codePostal: String,
  coloc: Boolean,
  date_entree_logement: Date,
  _departement: String,
  depcom: String,
  _epci: String,
  _epciType: String,
  logement_chambre: Boolean,
  loyer: Number,
  _nombreMoisEntreeLogement: Number,
  _nomCommune: String,
  participation_frais: Boolean,
  _region: String,
  statut_occupation_logement: {
    type: String,
    enum: statutOccupationLogementValues,
  },
}

const parents = {
  _situation: {
    type: String,
    enum: [
      "en_couple",
      "separes",
      "celibataire",
      "decedes",
      "sans_autorite",
      "veuve",
    ],
  },
  _en_france: Boolean,
  nbptr: Number,
  rfr: Number,
}

const situation = {
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
