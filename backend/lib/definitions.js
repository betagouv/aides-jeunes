const concat = require("lodash/concat")

const ressources = require("../../lib/resources")
const { ENTITIES_PROPERTIES } = require("../../lib/mutualized-steps")

const famille = {
  bourse_lycee: Boolean,
  en_couple: Boolean,
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

const individuBase = {
  _id: false,
  id: String,
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
  bourse_criteres_sociaux_echelon: Number,
  _bourseCriteresSociauxCommuneDomicileFamilial: String,
  _bourseCriteresSociauxCommuneDomicileFamilialCodePostal: String,
  _bourseCriteresSociauxCommuneDomicileFamilialDepartement: String,
  _bourseCriteresSociauxCommuneDomicileFamilialEpci: String,
  _bourseCriteresSociauxCommuneDomicileFamilialEpciType: String,
  _bourseCriteresSociauxCommuneDomicileFamilialNomCommune: String,
  _bourseCriteresSociauxCommuneDomicileFamilialRegion: String,
  date_debut_chomage: Date,
  enfant_a_charge: Object,
  _firstName: String,
  _hasRessources: Boolean,
  _nombreMoisDebutContratDeTravail: {
    type: Number,
    enum: [2, 5, 12],
  },
  _role: { type: String, enum: ["demandeur", "conjoint", "enfant"] },
  taux_incapacite: Number,
  tns_autres_revenus_type_activite: {
    type: String,
    enum: ["achat_revente", "bic", "bnc"],
  },
}

const individu = Object.assign(individuBase, allRessources)

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
  _codePostal: String,
  charges_locatives: Number,
  date_entree_logement: Date,
  _departement: String,
  depcom: String,
  _epci: String,
  _epciType: String,
  loyer: Number,
  _nombreMoisEntreeLogement: Number,
  _nomCommune: String,
  _region: String,
  statut_occupation_logement: {
    type: String,
    enum: statutOccupationLogementValues,
  },
}

const parents = {}

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

const entities = {
  famille,
  individu,
  menage,
  parents,
}

Object.entries(ENTITIES_PROPERTIES).forEach(
  ([entityName, entityProperties]) => {
    Object.entries(entityProperties.STEPS).forEach(
      ([propertyName, property]) => {
        if (entities[entityName][propertyName]) {
          return
        }
        switch (property.questionType) {
          case "enum": {
            entities[entityName][propertyName] = {
              type: String,
              enum: property.items.map((item) => item.value),
            }
            break
          }
          case "number": {
            entities[entityName][propertyName] = Number
            break
          }
          case "date": {
            entities[entityName][propertyName] = Date
            break
          }
          case "multiple": {
            entities[entityName][propertyName] = entities[entityName][
              propertyName
            ] = {
              type: [String],
              enum: property.items.map((item) => item.value),
            }
            break
          }
          default:
            entities[entityName][propertyName] = Boolean
        }
      }
    )
  }
)

const ANSWER_ENTITY_NAMES = [
  "individu",
  "enfants",
  "famille",
  "parents",
  "menage",
]

// Liste des champs n'existant plus dans le simulateur mais stockés dans les anciennes simulation
const LEGACY_FIELD_NAMES = [
  "aide_jeunes_diplomes_anciens_boursiers_base_ressources",
  "_boursier_derniere_annee_etudes",
  "_continuite_etudes",
  "date_arret_de_travail",
  "plus_haut_diplome_niveau",
  "plus_haut_diplome_date_obtention",
  "duree_possession_titre_sejour",
]

const ANSWER_FIELD_NAMES = [
  ...Object.keys(famille),
  ...Object.keys(individuBase),
  ...Object.keys(menage),
  ...Object.keys(parents),
  ...ressources.ressourceCategories.map((category) => category.id),
  "ressources",
  ...LEGACY_FIELD_NAMES,
]

const ANSWER_BASIC_IDS = [undefined, "demandeur", "conjoint", "enfants"]

module.exports = {
  famille,
  foyerFiscal,
  individu,
  menage,
  parents,
  situation,
  ANSWER_ENTITY_NAMES,
  ANSWER_FIELD_NAMES,
  ANSWER_BASIC_IDS,
}
