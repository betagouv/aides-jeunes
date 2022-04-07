/*
 * Supprime les id lorsqu'ils ne sont plus nécessaires
 */
const omit = require("lodash/omit")
const { ANSWER_BASIC_IDS } = require("../../definitions")
const VERSION = 8

function removeIds(answers) {
  // eslint-disable-next-line no-constant-condition
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

module.exports = {
  function: function (simulation) {
    removeIds(simulation.answers.all)
    removeIds(simulation.answers.current)
    return simulation
  },
  version: VERSION,
}
