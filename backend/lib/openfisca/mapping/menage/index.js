const cloneDeep = require("lodash/cloneDeep")
const moment = require("moment")

function buildOpenFiscaMenage(situation) {
  var openFiscaMenage = cloneDeep(situation.menage)
  openFiscaMenage.date_entree_logement = moment(situation.dateDeValeur)
    .add(openFiscaMenage._nombreMoisEntreeLogement, "months")
    .format("YYYY-MM-DD")
  return openFiscaMenage
}

module.exports = buildOpenFiscaMenage
