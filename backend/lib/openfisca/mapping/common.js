const moment = require("moment")
const assign = require("lodash/assign")

const { forEach } = require("../../../../data/js/benefits/back")
const { generator } = require("../../../../lib/Dates")
const {
  CONDITION_STATEGY,
} = require("../../../../lib/Benefits/ComputeFrontEnd")

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
forEach((aide, aideId) => {
  if (aide.computesLocally) {
    return
  }

  const item = aide.openfisca_eligibility_source || aideId
  requestedVariables[item] = requestedVariables[item] || assign({}, aide)
  if (aide.uncomputability) {
    requestedVariables[aideId + "_non_calculable"] = assign({}, aide, {
      type: "string",
    })
  }

  // Ajoute des variables dans la liste des paramètres à retourner par openfisca
  if (aide.extra) {
    appendExtraVariables(requestedVariables, aide.extra)
  }
})

// Ajoute des variables dans la liste des paramètres à retourner par openfisca
Object.values(CONDITION_STATEGY).forEach((condition) => {
  if (condition.extra) {
    appendExtraVariables(requestedVariables, condition.extra)
  }
})

exports.requestedVariables = requestedVariables
