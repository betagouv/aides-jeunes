var moment = require("moment")
var cloneDeep = require("lodash/cloneDeep")

function formatDate(date) {
  return date && moment(date).format("YYYY-MM-DD")
}

function buildOpenFiscaMenage(mesAidesMenage) {
  var openFiscaMenage = cloneDeep(mesAidesMenage)
  openFiscaMenage.date_entree_logement = formatDate(
    openFiscaMenage.date_entree_logement
  )
  return openFiscaMenage
}

module.exports = buildOpenFiscaMenage
