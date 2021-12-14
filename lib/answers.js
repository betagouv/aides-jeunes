export const isStepAnswered = (answers, step) =>
  getStepAnswer(answers, step) !== undefined

export const getStepAnswer = (answers, step) =>
  getAnswer(answers, step.entity, step.variable, step.id)

export const getAnswer = (answers, entity, variable, id) => {
  const answer = answers.find(
    (answer) =>
      answer.id === id &&
      answer.entityName === entity &&
      answer.fieldName === variable
  )
  return answer ? answer.value : undefined
}
