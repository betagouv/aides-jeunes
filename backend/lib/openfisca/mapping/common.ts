import dayjs from "dayjs"
import lodash from "lodash"
const assign = lodash.assign

import benefits from "../../../../data/all.js"
import { generator } from "../../../../lib/dates.js"
import { CONDITION_STATEGY } from "../../../../lib/benefits/compute-javascript.js"

import { openfiscaPeriodsLayout } from "../../../types/openfisca.js"

function isIndividuValid(individu, situation) {
  const age = dayjs(situation.dateDeValeur).diff(
    dayjs(individu.date_naissance),
    "year"
  )
  return individu._role != "enfant" || age <= 25 || individu.handicap
}

function getDemandeur(situation) {
  return situation.demandeur
}

function getConjoint(situation) {
  return situation.conjoint
}

function getEnfants(situation) {
  return situation.enfants
}

function getIndividusSortedParentsFirst(situation) {
  return []
    .concat(
      getDemandeur(situation),
      getConjoint(situation),
      getEnfants(situation)
    )
    .filter(function (individu) {
      return individu
    })
}

function getPeriods(dateDeValeur): openfiscaPeriodsLayout {
  dateDeValeur = dayjs(dateDeValeur)
  const dateMap = generator(dateDeValeur)
  const keys = Object.keys(dateMap)
  const output = {
    today: "",
    thisMonth: "",
    thisYear: "",
    oneMonthAgo: "",
    twoMonthsAgo: "",
    threeMonthsAgo: "",
    twelveMonthsAgo: "",
    last3Months: [],
    last12Months: [],
    lastYear: "",
    fiscalYear: "",
    fiscalYear12Months: [],
    previousFiscalYear: "",
    previousFiscalYear12Months: [],
    threeYearsAgo: "",
  }
  keys.reduce((result, key) => {
    // Manage single item and maps
    result[key] = dateMap[key].id
      ? dateMap[key].id
      : dateMap[key].map((i) => i.id)
    return result
  }, {})
  return output
}

function appendExtraVariables(requestedVariables, extraVariables) {
  extraVariables.forEach(function (extra) {
    requestedVariables[extra.id] =
      requestedVariables[extra.id] || assign({}, extra)
  })
}

const requestedVariables = {}
benefits.all
  .filter((benefit) => benefit.source === "openfisca")
  .forEach((benefit) => {
    const item = benefit.openfisca_eligibility_source || benefit.id
    requestedVariables[item] = requestedVariables[item] || assign({}, benefit)
    if (benefit.uncomputability) {
      requestedVariables[`${benefit.id}_non_calculable`] = assign({}, benefit, {
        type: "string",
      })
    }

    // Ajoute des variables dans la liste des paramètres à retourner par openfisca
    if (benefit.extra) {
      appendExtraVariables(requestedVariables, benefit.extra)
    }
  })

// Ajoute des variables dans la liste des paramètres à retourner par openfisca
for (const condition in CONDITION_STATEGY) {
  if (CONDITION_STATEGY[condition]?.extra) {
    appendExtraVariables(requestedVariables, CONDITION_STATEGY[condition].extra)
  }
}

export default {
  isIndividuValid,
  getDemandeur,
  getConjoint,
  getEnfants,
  getPeriods,
  getIndividusSortedParentsFirst,
  requestedVariables,
}
