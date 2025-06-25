/*
 * Déplace _interetAidesVeloElectrique dans _interetsAidesVelo
 */

const VERSION = 5

function update_interetAidesVeloElectrique(answers) {
  const answerIndex = answers.findIndex(
    (answer) =>
      answer.id === "demandeur" &&
      answer.entityName === "individu" &&
      answer.fieldName === "_interetAidesVeloElectrique",
  )

  if (answerIndex < 0) return

  answers[answerIndex].fieldName = "_interetsAidesVelo"

  if (answers[answerIndex].value) {
    answers[answerIndex].value = ["velo_electrique"]
  } else {
    answers[answerIndex].value = []
  }
}

export default {
  apply(simulation) {
    update_interetAidesVeloElectrique(simulation.answers.all)
    update_interetAidesVeloElectrique(simulation.answers.current)
    return simulation
  },
  version: VERSION,
}
