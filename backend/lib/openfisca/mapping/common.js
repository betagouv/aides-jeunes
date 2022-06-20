const moment = require("moment")
const assign = require("lodash/assign")

const benefits = require("../../../../data/all")
const { generator } = require("../../../../lib/dates")
const {
  CONDITION_STATEGY,
} = require("../../../../lib/benefits/compute-javascript")

exports.isIndividuValid = function (individu, situation) {
  const age = moment(situation.dateDeValeur).diff(
    moment(individu.date_naissance),
    "years"
  )
  return individu._role != "enfant" || age <= 25 || individu.handicap
}

exports.getDemandeur = function (situation) {
  return situation.demandeur
}

exports.getConjoint = function (situation) {
  return situation.conjoint
}

exports.getEnfants = function (situation) {
  return situation.enfants
}

exports.getIndividusSortedParentsFirst = function (situation) {
  return []
    .concat(
      exports.getDemandeur(situation),
      exports.getConjoint(situation),
      exports.getEnfants(situation)
    )
    .filter(function (individu) {
      return individu
    })
}

exports.getPeriods = function (dateDeValeur) {
  dateDeValeur = moment(dateDeValeur)
  const dateMap = generator(dateDeValeur)
  const keys = Object.keys(dateMap)
  return keys.reduce((result, key) => {
    // Manage single item and maps
    result[key] = dateMap[key].id
      ? dateMap[key].id
      : dateMap[key].map((i) => i.id)
    return result
  }, {})
}

function appendExtraVariables(requestedVariables, extraVariables) {
  extraVariables.forEach(function (extra) {
    requestedVariables[extra.id] =
      requestedVariables[extra.id] || assign({}, extra)
  })
}

let requestedVariables = {}
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
Object.values(CONDITION_STATEGY).forEach((condition) => {
  if (condition.extra) {
    appendExtraVariables(requestedVariables, condition.extra)
  }
})

exports.requestedVariables = requestedVariables
