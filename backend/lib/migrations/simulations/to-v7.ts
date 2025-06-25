/*
 * Migre Loyer
 */

const VERSION = 7

function updateLoyer(answers) {
  const indexOfLoyer = answers.findIndex(
    (answer) =>
      answer.id === "menage" &&
      answer.entityName === "menage" &&
      answer.fieldName === "loyer",
  )
  if (indexOfLoyer > -1) {
    const indexOfChargesLocatives = answers.findIndex(
      (answer) =>
        answer.id === "menage" &&
        answer.entityName === "menage" &&
        answer.fieldName === "charges_locatives",
    )
    answers[indexOfLoyer] = {
      entityName: "menage",
      fieldName: "loyer",
      value: {
        loyer: answers[indexOfLoyer]?.value,
        charges_locatives: answers[indexOfChargesLocatives]?.value || 0,
      },
    }

    answers.splice(indexOfChargesLocatives, 1) // 2nd parameter means remove one item only
  }
}

export default {
  apply(simulation) {
    updateLoyer(simulation.answers.all)
    updateLoyer(simulation.answers.current)
    return simulation
  },
  version: VERSION,
}
