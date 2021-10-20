const currency = require("currency.js")

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

function formatCurrency(value, unit, frac) {
  return currency(value, {
    symbol: ` ${unit}`,
    pattern: "#!",
    precision: frac,
    separator: " ",
  }).format()
}

function getFractionSize(droit) {
  return droit.floorAt < 1 ? 2 : 0
}

function formatDroitEstime(droit) {
  let droitEstime = {
    label: undefined,
    legend: getBenefitLegend(droit),
    type: droit.type || "float",
    value: droit.montant || 1,
    unit: droit.unit || "€",
    icon: undefined,
  }
  switch (droit.type) {
    case "float":
    case "string":
      break
    case "bool":
      droitEstime.icon = droit.icon || "fa-check-circle"
      break
    case "mixed":
      if (typeof droitEstime.value === "boolean") {
        droitEstime.type = "bool"
        droitEstime.legend = ""
      } else {
        droitEstime.type = "float"
      }
      break
  }

  switch (droit.unit) {
    case "€":
      droitEstime.label = "Montant estimé"
      if (droit.participation) {
        droitEstime.label = "Coût estimé"
      }
      break
    case "%":
    case "séances":
      break
    default:
      droitEstime.label = "Valeur estimée"
      break
  }

  if (droit.floorAt) {
    droitEstime.value = formatCurrency(
      droitEstime.value,
      droitEstime.unit,
      getFractionSize(droit)
    )
  }

  return droitEstime
}

module.exports = {
  PERIODICITE_PONCTUELLE,
  PERIODICITE_MENSUELLE,
  PERIODICITE_ANNUELLE,
  PERIODICITE_AUTRE,
  getBenefitLegend,
  formatDroitEstime,
}
