const openfisca = require("../openfisca")

function PNDS(simulation) {
  this.situation = simulation.getSituation()
}

PNDS.prototype.toInternal = function () {
  return {}
}

PNDS.prototype.toExternal = function () {
  return openfisca.buildOpenFiscaRequest(this.situation)
}

module.exports = PNDS
