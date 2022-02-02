/*
 * Déplace allAnswers et currentAnswers dans answers
 */

const VERSION = 4

module.exports = {
  function: function (simulation) {
    const objectSimulation = simulation.toObject
      ? simulation.toObject()
      : simulation
    simulation.answers = {
      all: objectSimulation.all,
      current: objectSimulation.current,
    }
    return simulation
  },
  version: VERSION,
}
