import openfisca from "../openfisca/index.js"

function PNDS(simulation) {
  this.situation = simulation.getSituation()
}

PNDS.prototype.toInternal = function () {
  return {}
}

PNDS.prototype.toExternal = function () {
  return openfisca.buildOpenFiscaRequest(this.situation)
}

export default PNDS
