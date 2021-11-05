const openfisca = require("../openfisca")

function OpenFiscaTracer(situation) {
  this.situation = situation
}

OpenFiscaTracer.prototype.toInternal = function () {
  return {}
}

OpenFiscaTracer.prototype.toExternal = function () {
  return openfisca.buildOpenFiscaRequest(this.situation)
}

module.exports = OpenFiscaTracer
