/*
 * Déplace _interetAidesVeloElectrique dans _interetsAidesVelo
 */

const VERSION = 5

function update_interetAidesVeloElectrique(answers) {
  const answer = answers.find(
    (answer) =>
      answer.id === "demandeur" &&
      answer.entityName === "individu" &&
      answer.fieldName === "_interetAidesVeloElectrique"
  )

  if (answer?.value) {
    answer.fieldName = "_interetsAidesVelo"
    answers.value = ["velo_electrique"]
  }
}

module.exports = {
  function: function (simulation) {
    update_interetAidesVeloElectrique(simulation.answers.all)

    update_interetAidesVeloElectrique(simulation.answers.current)
    return simulation
  },
  version: VERSION,
}
