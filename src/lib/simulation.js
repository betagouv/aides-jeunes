const Simulation = {}

Simulation.getLatest = function () {
  return document.cookie.split("; ").reduce((accum, pair) => {
    const [key, value] = pair.split("=", 2)
    accum[key] = value
    return accum
  }, {}).lastestSimulation
}

export default Simulation
