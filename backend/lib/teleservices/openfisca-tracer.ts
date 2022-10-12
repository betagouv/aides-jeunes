import openfisca from "../openfisca/index"

function OpenFiscaTracer(simulation) {
  this.situation = simulation.getSituation()
}

OpenFiscaTracer.prototype.toInternal = function () {
  return {}
}

OpenFiscaTracer.prototype.toExternal = function () {
  return openfisca.buildOpenFiscaRequest(this.situation)
}

export default OpenFiscaTracer
