/*
 * Extrait une question service_civique à partir
 * de la question activite
 */

const VERSION = 15

function transformAnswersWithServiceCivique(answers) {
  if (
    answers.find(
      (answer) =>
        answer.id === "demandeur" && answer.fieldName === "service_civique"
    )
  ) {
    return answers
  }

  const activityAnswer = answers.find((answer) => {
    return answer.id === "demandeur" && answer.fieldName === "activite"
  })

  if (!activityAnswer) {
    return answers
  }

  const isServiceCivique = activityAnswer.value === "service_civique"

  activityAnswer.value = isServiceCivique ? "inactif" : activityAnswer.value

  const serviceCiviqueAnswer = {
    entityName: "individu",
    fieldName: "service_civique",
    id: "demandeur",
    value: isServiceCivique,
  }

  // La question service_civique est ajouté juste avant la question handicap
  const handicapAnswerIndex = answers.findIndex((answer) => {
    return answer.id === "demandeur" && answer.fieldName === "handicap"
  })

  // Warning: splice modifie l'array en place
  answers.splice(handicapAnswerIndex, 0, serviceCiviqueAnswer)
  return answers
}

export default {
  apply(simulation) {
    simulation.answers.all = transformAnswersWithServiceCivique(
      simulation.answers.all
    )
    simulation.answers.current = transformAnswersWithServiceCivique(
      simulation.answers.current
    )

    return simulation
  },
  version: VERSION,
}
