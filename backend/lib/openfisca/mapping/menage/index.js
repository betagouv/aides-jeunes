const cloneDeep = require("lodash/cloneDeep")
const moment = require("moment")

function buildOpenFiscaMenage(situation) {
  var openFiscaMenage = cloneDeep(situation.menage)
  openFiscaMenage.date_entree_logement = moment(situation.dateDeValeur)
    .subtract(openFiscaMenage._dureeDateEntreeLogement ? 2 : 12, "months")
    .format("YYYY-MM-DD")
  return openFiscaMenage
}

module.exports = buildOpenFiscaMenage
