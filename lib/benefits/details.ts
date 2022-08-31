import currency from "currency.js"

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

function getBenefitLegend(benefit, parameters) {
  if (benefit.legend) {
    if (typeof benefit.legend === "function") {
      return benefit.legend(parameters)
    } else {
      return benefit.legend
    }
  }
  return LEGENDE_PERIODICITE_AIDE_ENUM[benefit.periodicite] || undefined
}

function formatCurrency(value, unit, precision) {
  return currency(value, {
    symbol: ` ${unit}`,
    pattern: "#!",
    precision,
    separator: " ",
  }).format()
}

function getDecimalPrecision(droit) {
  return droit.floorAt < 1 ? 2 : 0
}

interface droitEstimeLayout {
  id: any
  label?: any
  legend: any
  type: any
  value: any
  unit: any
  icon?: any
  uncomputability: boolean
}
function formatDroitEstime(droit, parameters) {
  const droitEstime: droitEstimeLayout = {
    id: droit.id || undefined,
    label: undefined,
    legend: getBenefitLegend(droit, parameters) || "",
    type: droit.type || "float",
    value: droit.montant || 1,
    unit: droit.unit || "€",
    icon: undefined,
    uncomputability: typeof droit.montant === "string",
  }
  switch (droit.type) {
    case "float":
    case "string":
    case "bool":
      break
    case "mixed":
      if (typeof droitEstime.value === "boolean") {
        droitEstime.type = "bool"
        droitEstime.legend = ""
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
          getDecimalPrecision(droit)
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

const getBenefitImage = (droit) => {
  return `/${droit.imgSrc ? droit.imgSrc : droit.institution.imgSrc}`
}

export {
  getBenefitLegend,
  formatDroitEstime,
  LEGENDE_PERIODICITE_AIDE_ENUM,
  PERIODICITE_PONCTUELLE,
  PERIODICITE_MENSUELLE,
  PERIODICITE_ANNUELLE,
  PERIODICITE_AUTRE,
  getBenefitImage,
}
