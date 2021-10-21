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

function formatCurrency(value, unit, precision) {
  return currency(value, {
    symbol: ` ${unit}`,
    pattern: "#!",
    precision,
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
        droitEstime.icon = droit.icon || "fa-check-circle"
      } else {
        droitEstime.type = "float"
        droitEstime.unit = "€"
        droitEstime.value = `${droitEstime.value} ${droitEstime.unit}`
      }
      break
  }

  switch (droitEstime.unit) {
    case "€":
      droitEstime.label = droit.participation ? "Coût estimé" : "Montant estimé"
      if (droit.floorAt) {
        droitEstime.value = formatCurrency(
          droitEstime.value,
          droitEstime.unit,
          getFractionSize(droit)
        )
      }
      break
    case "séances":
      droitEstime.value = `${droitEstime.value} ${droitEstime.unit}`
      break
    case "%":
      droitEstime.value = `${droitEstime.value} ${droitEstime.unit}`
      break
    default:
      droitEstime.label = "Valeur estimée"
      break
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
