const cloneDeep = require("lodash/cloneDeep")
const moment = require("moment")

function buildOpenFiscaMenage(situation) {
  console.log(situation)
  var openFiscaMenage = cloneDeep(situation.menage)
  console.log(openFiscaMenage)
  if (openFiscaMenage._nombreMoisEntreeLogement)
    openFiscaMenage.date_entree_logement = moment(situation.dateDeValeur)
      .subtract(openFiscaMenage._nombreMoisEntreeLogement ? 2 : 12, "months")
      .format("YYYY-MM-DD")
  return openFiscaMenage
}

module.exports = buildOpenFiscaMenage
