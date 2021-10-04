const PERIODICITE_PONCTUELLE = "ponctuelle"
const PERIODICITE_MENSUELLE = "mensuelle"
const PERIODICITE_ANNUELLE = "annuelle"
const PERIODICITE_AUTRE = "autre"

const LEGENDE_PERIODICITE_AIDE_ENUM = {
  [PERIODICITE_PONCTUELLE]: "",
  [PERIODICITE_MENSUELLE]: "/ mois",
  [PERIODICITE_ANNUELLE]: "/ an",
  [PERIODICITE_AUTRE]: "",
}

function getBenefitLegend(benefit) {
  return (
    benefit.legend || LEGENDE_PERIODICITE_AIDE_ENUM[benefit.periodicite] || ""
  )
}

module.exports = {
  PERIODICITE_PONCTUELLE,
  PERIODICITE_MENSUELLE,
  PERIODICITE_ANNUELLE,
  PERIODICITE_AUTRE,
  getBenefitLegend,
}
