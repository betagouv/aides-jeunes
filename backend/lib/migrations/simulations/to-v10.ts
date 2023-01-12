/*
 * Migre _formationSanitaireSocial vers groupe_specialites_formation
 */

import Scolarite from "../../../../lib/scolarite.js"

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

export default {
  apply(simulation) {
    updateGroupeSpecialitesFormation(simulation.answers.all)
    updateGroupeSpecialitesFormation(simulation.answers.current)
    return simulation
  },
  version: VERSION,
}
