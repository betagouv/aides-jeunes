/*
 * Supprime les fields plus utilisés
 */

const VERSION = 6

const ANSWER_TO_REMOVE = [
  {
    id: "nombre_enfants",
    entityName: "individu",
    fieldName: "nombre_enfants",
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
    answers.splice(index, 1)
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
