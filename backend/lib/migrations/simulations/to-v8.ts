/*
 * Supprime les id lorsqu'ils ne sont plus nécessaires
 */
import { omit } from "lodash-es"
import { ANSWER_BASIC_IDS } from "../../definitions.js"

const VERSION = 8

function removeIds(answers) {
  while (true) {
    const index = answers.findIndex(
      (answer) =>
        !(
          ANSWER_BASIC_IDS.includes(answer.id) ||
          answer.id.match(/^enfant_\d+$/)
        )
    )
    if (index > -1) {
      const result = omit(answers[index].toObject(), ["id", "_id"])
      answers[index] = result
    } else {
      break
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
