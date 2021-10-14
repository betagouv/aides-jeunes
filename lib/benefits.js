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
    benefit.legend ||
    LEGENDE_PERIODICITE_AIDE_ENUM[benefit.periodicite] ||
    undefined
  )
}

function formatAyantDroit(droit) {
  let ayantDroit = {
    label: undefined,
    legend: getBenefitLegend(droit),
    type: "",
    montant: droit.montant || 1,
    unit: droit.unit || "€",
    symbol: undefined,
  }
  switch (droit.type) {
    case "number":
      ayantDroit.montant = ayantDroit.montant + " " + ayantDroit.unit
      break
    case "bool":
      ayantDroit.symbol = droit.symbol || "fa-check-circle"
      break
    case "string":
      break
  }
  console.log(droit.participation)
  if (droit.participation) console.log(droit)

  switch (droit.unit) {
    case "€":
      ayantDroit.label = "Montant estimé"
      if (droit.participation) ayantDroit.label = "Coût estimé"
      break
    case "%":
      ayantDroit.label = "Valeur estimée"
      break
    case "séances":
      ayantDroit.label = "Nombre estimé"
      break
    default:
      ayantDroit.label = "Valeur estimée"
  }
  return ayantDroit
}

module.exports = {
  PERIODICITE_PONCTUELLE,
  PERIODICITE_MENSUELLE,
  PERIODICITE_ANNUELLE,
  PERIODICITE_AUTRE,
  getBenefitLegend,
  formatAyantDroit,
}
