/*
 * Extrait une question service_civique à partir
 * de la question activite
 */

import dayjs from "dayjs"

const VERSION = 15

function getAge(simulation) {
  let age = simulation.answers.all.find(
    (answer) => answer.id === "demandeur" && answer.fieldName === "age"
  )?.value

  if (age !== undefined) {
    return age
  }

  const dateOBirth = simulation.answers.all.find(
    (answer) =>
      answer.id === "demandeur" && answer.fieldName === "date_naissance"
  )?.value

  if (!dateOBirth) {
    // Dans ce cas on inserera la question service_civique
    // car undefined > 31 est false
    return
  }

  age = dayjs(simulation.dateDeValeur).diff(dateOBirth, "year")

  return age
}

function transformAnswersWithServiceCivique(answers, age) {
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

  // La question service civique n'est affiché que pour les moins de 31 ans
  if (!isServiceCivique && age > 31) {
    return answers
  }

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
    const age = getAge(simulation)

    simulation.answers.all = transformAnswersWithServiceCivique(
      simulation.answers.all,
      age
    )
    simulation.answers.current = transformAnswersWithServiceCivique(
      simulation.answers.current,
      age
    )

    return simulation
  },
  version: VERSION,
}
