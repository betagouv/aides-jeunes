const cloneDeep = require("lodash/cloneDeep")
const moment = require("moment")

function buildOpenFiscaMenage(situation) {
  var openFiscaMenage = cloneDeep(situation.menage)
  const now = moment(situation.dateDeValeur)
  let date_entree_logement
  if (openFiscaMenage._nombreMoisEntreeLogement === "future") {
    date_entree_logement = now.add(12, "months")
  } else if (openFiscaMenage._nombreMoisEntreeLogement === "recent") {
    date_entree_logement = now.subtract(2, "months")
  } else {
    date_entree_logement = now.subtract(12, "months")
  }

  openFiscaMenage.date_entree_logement =
    date_entree_logement.format("YYYY-MM-DD")
  return openFiscaMenage
}

module.exports = buildOpenFiscaMenage
