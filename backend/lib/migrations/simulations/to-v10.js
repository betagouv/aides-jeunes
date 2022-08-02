/*
 * Migre _formationSanitaireSocial vers groupe_specialites_formation
 */

const Scolarite = require("../../../../lib/scolarite")
const VERSION = 10

function updateGroupeSpecialitesFormation(answers) {
  const answerIndex = answers.findIndex(
    (answer) =>
      answer.id === "demandeur" &&
      answer.entityName === "individu" &&
      answer.fieldName === "_formationSanitaireSocial"
  )

  if (answerIndex < 0) return

  answers[answerIndex].fieldName = "groupe_specialites_formation"
  answers[answerIndex].value = answers[answerIndex].value
    ? Scolarite.groupeSpecialitesFormation
        .specialites_plurivalentes_sanitaires_et_sociales.value
    : Scolarite.groupeSpecialitesFormation.autre.value
}

module.exports = {
  function: function (simulation) {
    updateGroupeSpecialitesFormation(simulation.answers.all)
    updateGroupeSpecialitesFormation(simulation.answers.current)
    return simulation
  },
  version: VERSION,
}
