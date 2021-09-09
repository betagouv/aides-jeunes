const cloneDeep = require("lodash/cloneDeep")
const { formatDate } = require("../utils")

function buildOpenFiscaMenage(mesAidesMenage) {
  var openFiscaMenage = cloneDeep(mesAidesMenage)
  openFiscaMenage.date_entree_logement = formatDate(
    openFiscaMenage.date_entree_logement
  )
  return openFiscaMenage
}

module.exports = buildOpenFiscaMenage
