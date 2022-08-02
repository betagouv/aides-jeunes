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
