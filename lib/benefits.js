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
  }).format()
}

function getFractionSize(droit) {
  return droit.floorAt < 1 ? 2 : 0
}

function formatDroitEstime(droit) {
  let droitEstime = {
    label: undefined,
    legend: getBenefitLegend(droit),
    type: "",
    value: droit.montant || 1,
    unit: droit.unit || "€",
    icon: undefined,
  }
  switch (droit.type) {
    case "float":
      droitEstime.value = droitEstime.value + " " + droitEstime.unit
      break
    case "bool":
      droitEstime.icon = droit.icon || "fa-check-circle"
      break
    case "string":
      break
  }

  switch (droit.unit) {
    case "€":
      droitEstime.label = "Montant estimé"

      if (droit.participation) droitEstime.label = "Coût estimé"

      if (droit.floorAt) {
        droitEstime.value = formatCurrency(
          droitEstime.value,
          droitEstime.unit,
          getFractionSize(droit)
        )
      }

      break
    case "%":
      droitEstime.label = "Valeur estimée"
      break
    case "séances":
      droitEstime.label = "Nombre estimé"
      break
    default:
      droitEstime.label = "Valeur estimée"
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
