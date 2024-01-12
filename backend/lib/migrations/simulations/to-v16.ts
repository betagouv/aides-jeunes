/*
 * Modification de la question sur l'alternance dans la fonction publique
 */

const VERSION = 16

function updateAlternanceFonctionPubliqueAnswers(answers) {
  const answerIndex = answers.findIndex((answer) => {
    return answer.fieldName === "categorie_salarie"
  })

  if (answerIndex < 0) return

  answers[answerIndex].fieldName = "_alternanceFonctionPublique"

  return answers
}

export default {
  apply(simulation) {
    simulation.answers.all = updateAlternanceFonctionPubliqueAnswers(
      simulation.answers.all
    )
    simulation.answers.current = updateAlternanceFonctionPubliqueAnswers(
      simulation.answers.current
    )

    return simulation
  },
  version: VERSION,
}
