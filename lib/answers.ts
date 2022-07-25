import { answerLayout } from "./types/answer"

export function isStepAnswered(answers: answerLayout[], step) {
  getStepAnswer(answers, step) !== undefined
}

export const getStepAnswer = (answers: answerLayout[], step) =>
  getAnswer(answers, step.entity, step.variable, step.id)

export const getAnswer = (answers: answerLayout[], entity, variable, id?) => {
  const answer = answers.find(
    (answer) =>
      answer.id === id &&
      answer.entityName === entity &&
      answer.fieldName === variable
  )
  return answer ? answer.value : undefined
}
// Nécessaire si la question est optionnelle
export function nullifyUndefinedValue(value) {
  return value === undefined ? null : value
}
