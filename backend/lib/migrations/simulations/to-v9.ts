/*
 * Migre enceinte
 */

const VERSION = 9

function isEnceinteAnswer(answer) {
  return answer.entityName === "individu" && answer.fieldName === "enceinte"
}

function updateEnceinte(answers) {
  const enceinteAnswerIds = answers.reduce((accum, answer, index) => {
    return accum.concat(isEnceinteAnswer(answer) ? index : [])
  }, [])

  enceinteAnswerIds.forEach((enceinteAnswerId) => {
    const newValue = answers[enceinteAnswerId].value
      ? "enceinte"
      : "pas_enceinte"
    answers[enceinteAnswerId].set("value", newValue, { strict: false })
  })
}

export default {
  apply(simulation) {
    updateEnceinte(simulation.answers.all)
    updateEnceinte(simulation.answers.current)
    return simulation
  },
  version: VERSION,
}
