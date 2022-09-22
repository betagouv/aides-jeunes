import { concat } from "lodash"

import ressources from "../../lib/resources"
import { forEachProperties } from "../../lib/mutualized-steps"

const famille = []

const foyerFiscal = ["rfr"]

const allRessources = concat(
  ressources.ressourceTypes,
  ressources.categoriesRnc,
  ressources.patrimoineTypes
).map((ressource) => ressource.id)
// tns_autres_revenus_type_activite field is required when you choose rpns_autres_revenus
allRessources.push("tns_autres_revenus_type_activite")

const individuBase = [
  "_id",
  "id",
  "bourse_criteres_sociaux_echelon",
  "_bourseCriteresSociauxCommuneDomicileFamilial",
  "_hasRessources",
  "_role",
]

const individu = [...individuBase, ...allRessources]

const menage = [
  "aide_logement_date_pret_conventionne",
  "charges_locatives",
  "date_entree_logement",
  "depcom",
  "loyer",
  "statut_occupation_logement",
]

const parents = []

export const entities = {
  famille,
  individu,
  menage,
  parents,
  foyerFiscal,
}

forEachProperties((entityName, propertyName) => {
  if (entities[entityName].includes(propertyName)) {
    return
  }
  entities[entityName].push(propertyName)
})

export const ANSWER_ENTITY_NAMES = [
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

export const ANSWER_FIELD_NAMES = [
  "age", // For anonymized answers
  ...famille,
  ...individu,
  ...menage,
  ...parents,
  ...ressources.ressourceCategories.map((category) => category.id),
  "ressources",
  ...LEGACY_FIELD_NAMES,
]

export const ANSWER_BASIC_IDS = [undefined, "demandeur", "conjoint", "enfants"]

export default {
  ...entities,
  ANSWER_ENTITY_NAMES,
  ANSWER_FIELD_NAMES,
  ANSWER_BASIC_IDS,
}
