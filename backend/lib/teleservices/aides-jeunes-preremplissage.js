const openfisca = require("../openfisca")
const Simulation = require("mongoose").model("Simulation")

function AidesJeunesPreremplissage(simulation) {
  this.simulation = simulation
}

AidesJeunesPreremplissage.prototype.toInternal = function () {
  return {}
}

AidesJeunesPreremplissage.prototype.toExternal = function () {
  try {
    const p = this.simulation
      .compute()
      .then((results) => {
        return results
      })
      .catch((err) => {
        return { err: err.toString() }
      })
    return p
  } catch (e) {
    console.log(e)
  }
}

module.exports = AidesJeunesPreremplissage
