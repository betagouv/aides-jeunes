import { Answer } from "./types/answer.js"

export function isStepAnswered(answers: Answer[], step) {
  return getStepAnswer(answers, step) !== undefined
}

export const getStepAnswer = (answers: Answer[], step) =>
  getAnswer(answers, step.entity, step.variable, step.id)

export const getAnswer = (answers: Answer[], entity, variable?, id?) => {
  const answer = answers.find(
    (answer) =>
      answer.id === id &&
      answer.entityName === entity &&
      answer.fieldName === variable
  )
  return answer ? answer.value : undefined
}

export const getAnswerIndex = (
  answers: Answer[],
  entityName,
  id,
  fieldName
) => {
  return answers.findIndex((answer) => {
    if (entityName && id && fieldName) {
      return (
        answer.entityName === entityName &&
        answer.id === id &&
        answer.fieldName === fieldName
      )
    } else if (entityName && id) {
      return answer.entityName === entityName && answer.id === id
    } else if (entityName) {
      return answer.entityName === entityName
    }
  })
}

// Nécessaire si la question est optionnelle
export function nullifyUndefinedValue(value) {
  return value === undefined ? null : value
}

export function storeAnswer(answers: Answer[], newAnswer: Answer): Answer[] {
  const existingAnswerIndex = answers.findIndex(
    (answer) =>
      answer.id === newAnswer.id &&
      answer.entityName === newAnswer.entityName &&
      answer.fieldName === newAnswer.fieldName
  )

  if (existingAnswerIndex === -1) {
    return [...answers, newAnswer]
  } else {
    answers[existingAnswerIndex].value = newAnswer.value
    return [...answers]
  }
}
