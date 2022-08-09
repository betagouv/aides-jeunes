/*
 * Déplace answers.all et answers.current dans simulation.answers
 */

const VERSION = 4

export default {
  function(simulation) {
    const objectSimulation = simulation.toObject
      ? simulation.toObject()
      : simulation
    simulation.answers = {
      all: objectSimulation.all,
      current: objectSimulation.current,
    }
    simulation.set("all", undefined, { strict: false })
    simulation.set("current", undefined, { strict: false })
    return simulation
  },
  version: VERSION,
}
