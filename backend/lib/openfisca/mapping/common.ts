import dayjs from "dayjs"

import benefits from "../../../../data/all.js"
import { generator } from "../../../../lib/dates.js"
import { CONDITION_STRATEGY } from "../../../../lib/benefits/compute-javascript.js"

import {
  OpenfiscaPeriods,
  OpenfiscaVariables,
} from "../../../types/openfisca.d.js"
import { BenefitExtra } from "@data/types/benefits.js"

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

function getPeriods(dateDeValeur: Date): OpenfiscaPeriods {
  const dateMap = generator(dateDeValeur)
  const keys = Object.keys(dateMap)
  return keys.reduce((result, key) => {
    // Manage single item and maps
    result[key] = dateMap[key].id
      ? dateMap[key].id
      : dateMap[key].map((i) => i.id)
    return result
  }, {} as OpenfiscaPeriods)
}

function appendExtraVariables(
  requestedVariables: OpenfiscaVariables,
  extraVariables: BenefitExtra[] = []
) {
  extraVariables.forEach(function (extra) {
    requestedVariables[extra.id] ??= { ...extra }
  })
}

const requestedVariables: OpenfiscaVariables = {}
benefits.all
  .filter((benefit) => benefit.source === "openfisca")
  .forEach((benefit) => {
    const item = benefit.openfisca_eligibility_source || benefit.id
    requestedVariables[item] ??= { ...benefit }

    // Ajoute des variables dans la liste des paramètres à retourner par openfisca
    if (benefit.extra) {
      appendExtraVariables(requestedVariables, benefit.extra)
    }
  })

// Ajoute des variables dans la liste des paramètres à retourner par openfisca
for (const condition in CONDITION_STRATEGY) {
  if (CONDITION_STRATEGY[condition].extra) {
    appendExtraVariables(
      requestedVariables,
      CONDITION_STRATEGY[condition]!.extra
    )
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
