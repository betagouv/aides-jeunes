/*
 * Déplace allAnswers et currentAnswers dans answers
 */
const VERSION = 4

module.exports = {
  function: function (simulation) {
    simulation.answers = {
      all: simulation.all,
      current: simulation.current,
    }

    delete simulation.all
    delete simulation.current

    return simulation
  },
  version: VERSION,
}
