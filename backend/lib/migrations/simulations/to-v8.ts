/*
 * Supprime les id lorsqu'ils ne sont plus nécessaires
 */
import { omit } from "lodash"
import { ANSWER_BASIC_IDS } from "../../definitions"

const VERSION = 8

function removeIds(answers) {
  let index = null
  while (!index || index > -1) {
    index = answers.findIndex(
      (answer) =>
        !(
          ANSWER_BASIC_IDS.includes(answer.id) ||
          answer.id.match(/^enfant_\d+$/)
        )
    )
    if (index) {
      const result = omit(answers[index].toObject(), ["id", "_id"])
      answers[index] = result
    }
  }
}

export default {
  apply(simulation) {
    removeIds(simulation.answers.all)
    removeIds(simulation.answers.current)
    return simulation
  },
  version: VERSION,
}
