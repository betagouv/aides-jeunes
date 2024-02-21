/*
 * Modification du nom du champ _contrat_alternant en _contratAlternance
 */

const VERSION = 17

function updateContratAlternanceAnswers(answers) {
  const answerIndex = answers.findIndex((answer) => {
    return answer.fieldName === "_contrat_alternant"
  })

  if (answerIndex >= 0) {
    answers[answerIndex].fieldName = "_contratAlternance"
  }
  return answers
}

export default {
  apply(simulation) {
    simulation.answers.all = updateContratAlternanceAnswers(
      simulation.answers.all
    )
    simulation.answers.current = updateContratAlternanceAnswers(
      simulation.answers.current
    )

    return simulation
  },
  version: VERSION,
}
