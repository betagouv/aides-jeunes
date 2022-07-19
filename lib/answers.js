exports.isStepAnswered = (answers, step) =>
  getStepAnswer(answers, step) !== undefined

const getStepAnswer = (answers, step) =>
  getAnswer(answers, step.entity, step.variable, step.id)
exports.getStepAnswer = getStepAnswer

const getAnswer = (answers, entity, variable, id) => {
  const answer = answers.find(
    (answer) =>
      answer.id === id &&
      answer.entityName === entity &&
      answer.fieldName === variable
  )
  return answer ? answer.value : undefined
}
exports.getAnswer = getAnswer

// Nécessaire si la question est optionnelle
exports.nullifyUndefinedValue = (value) => {
  return value === undefined ? null : value
}

exports.storeAnswer = (answers, newAnswer, clean, enfants) => {
  const existingAnswerIndex = answers.findIndex(
    (answer) =>
      answer.id === newAnswer.id &&
      answer.entityName === newAnswer.entityName &&
      answer.fieldName === newAnswer.fieldName
  )
  let results
  if (existingAnswerIndex === -1) {
    results = [...answers, newAnswer]
  } else {
    const answer = answers[existingAnswerIndex]
    answer.value = newAnswer.value
    if (clean) {
      // Keep all answers related to children because they are not on the same path
      const allowedAnswered = enfants
        ? enfants
            .map((enfant) => `enfant_${enfant}`)
            .filter((id) => id !== newAnswer.id)
        : []
      results = answers.slice(0, existingAnswerIndex + 1)
      results = results.concat(
        answers.filter(
          (answer) =>
            allowedAnswered.includes(answer.id) &&
            results.find((result) => result.id !== answer.id)
        )
      )
    } else {
      results = [...answers]
    }
  }

  return results
}
