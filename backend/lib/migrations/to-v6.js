/*
 * Supprime les fields plus utilisés
 */

const VERSION = 6

const ANSWER_TO_REMOVE = [
  { id: "demandeur", entityName: "individu", fieldName: "_continuite_etudes" },
  {
    id: "demandeur",
    entityName: "individu",
    fieldName: "plus_haut_diplome_niveau",
  },
  {
    id: "demandeur",
    entityName: "individu",
    fieldName: "plus_haut_diplome_date_obtention",
  },
  {
    id: "nombre_enfants",
    entityName: "individu",
    fieldName: "nombre_enfants",
  },
  {
    id: "demandeur",
    entityName: "individu",
    fieldName: "aide_jeunes_diplomes_anciens_boursiers_base_ressources",
  },
  {
    id: "demandeur",
    entityName: "individu",
    fieldName: "_boursier_derniere_annee_etudes",
  },
]

function removeOldField(answers, { id, entityName, fieldName }) {
  const index = answers.findIndex(
    (answer) =>
      answer.id === id &&
      answer.entityName === entityName &&
      answer.fieldName === fieldName
  )
  if (index > -1) {
    answers.splice(index, 1) // 2nd parameter means remove one item only
  }
}

function removeOldFields(answers) {
  ANSWER_TO_REMOVE.forEach((answerToRemove) =>
    removeOldField(answers, answerToRemove)
  )
}

module.exports = {
  function: function (simulation) {
    removeOldFields(simulation.answers.all)
    removeOldFields(simulation.answers.current)
    return simulation
  },
  version: VERSION,
}
