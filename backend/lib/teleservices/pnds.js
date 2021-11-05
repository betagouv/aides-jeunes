const openfisca = require("../openfisca")

function PNDS(situation) {
  this.situation = situation
}

PNDS.prototype.toInternal = function () {
  return {}
}

PNDS.prototype.toExternal = function () {
  return openfisca.buildOpenFiscaRequest(this.situation)
}

module.exports = PNDS
