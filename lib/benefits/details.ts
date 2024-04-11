import currency from "currency.js"
import { DroitEstime } from "../types/details.js"
import { StandardBenefit } from "@data/types/benefits.d.js"
import { OpenfiscaParameters } from "@lib/types/parameters.d.js"

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

function getBenefitLegend(
  benefit: StandardBenefit,
  parameters: OpenfiscaParameters
): string {
  if (benefit.legend) {
    if (typeof benefit.legend === "function") {
      return benefit.legend(parameters)
    } else {
      return benefit.legend
    }
  }
  return LEGENDE_PERIODICITE_AIDE_ENUM[benefit.periodicite] || ""
}

function formatCurrency(value, unit, precision) {
  return currency(value, {
    symbol: ` ${unit}`,
    pattern: "#!",
    precision,
    separator: " ",
  }).format()
}

function getDecimalPrecision(droit: StandardBenefit) {
  return droit.floorAt < 1 ? 2 : 0
}

function getValueOfBoolean(value: boolean) {
  return value ? "Éligible" : "Non éligible"
}

function formatDroitEstime(
  droit: StandardBenefit,
  parameters: OpenfiscaParameters
) {
  const droitEstime: DroitEstime = {
    id: droit.id,
    label: droit.label,
    legend: getBenefitLegend(droit, parameters),
    type: droit.type || "float",
    value: droit.montant || 1,
    unit: droit.unit || "€",
  }
  switch (droit.type) {
    case "float":
    case "string":
      break
    case "bool":
      droitEstime.value = getValueOfBoolean(droit.montant as boolean)
      break
    case "mixed":
      if (typeof droitEstime.value === "boolean") {
        droitEstime.type = "bool"
        droitEstime.legend = ""
        droitEstime.value = getValueOfBoolean(droit.montant as boolean)
      } else {
        droitEstime.type = "float"
        droitEstime.unit = "€"
        droitEstime.value = `${droitEstime.value} ${droitEstime.unit}`
      }
      break
  }

  if (droitEstime.type !== "bool") {
    switch (droitEstime.unit) {
      case "€":
        droitEstime.label = droit.participation
          ? "Coût estimé"
          : "Montant estimé"
        if (droit.floorAt) {
          droitEstime.value = formatCurrency(
            droitEstime.value,
            droitEstime.unit,
            getDecimalPrecision(droit)
          )
        }
        break
      case "séances":
        delete droitEstime.label
        droitEstime.value = `${droitEstime.value} ${droitEstime.unit}`
        break
      case "%":
        droitEstime.label = "Valeur estimée"
        droitEstime.value = `${droitEstime.value} ${droitEstime.unit}`
        break
      default:
        droitEstime.label = "Valeur estimée"
        break
    }
  }

  return droitEstime
}

const getBenefitImage = (droit: StandardBenefit) => {
  return droit.imgSrc ? droit.imgSrc : droit.institution.imgSrc
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
