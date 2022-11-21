import { answerLayout } from "./types/answer"

export function isStepAnswered(answers: answerLayout[], step) {
  return getStepAnswer(answers, step) !== undefined
}

export const getStepAnswer = (answers: answerLayout[], step) =>
  getAnswer(answers, step.entity, step.variable, step.id)

export const getAnswer = (answers: answerLayout[], entity, variable?, id?) => {
  const answer = answers.find(
    (answer) =>
      answer.id === id &&
      answer.entityName === entity &&
      answer.fieldName === variable
  )
  return answer ? answer.value : undefined
}

export const getAnswerIndexByPath = (answers: answerLayout[], path) => {
  return answers.findIndex((answer) => answer.path === path)
}

export const getAnswerIndex = (
  answers: answerLayout[],
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

export function storeAnswer(answers, newAnswer, clean, enfants?) {
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
