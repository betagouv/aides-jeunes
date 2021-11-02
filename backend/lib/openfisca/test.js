var common = require("./mapping/common")
var mapping = require("./mapping")
var forEach = require("lodash/forEach")
var assign = require("lodash/assign")
var pick = require("lodash/pick")
var benefits = require("../../../data/js/benefits/back")

function toStringOf(obj) {
  return obj.toString()
}

var ID_PROPERTIES = {
  familles: ["enfants", "parents"],
  foyers_fiscaux: ["declarants", "personnes_a_charge"],
  individus: ["id"],
  menages: ["conjoint", "enfants", "personne_de_reference"],
}

function normalizeIDs(test) {
  Object.keys(ID_PROPERTIES).forEach(function (entity) {
    if (test[entity]) {
      forEach(test[entity], function (value, index) {
        forEach(ID_PROPERTIES[entity], function (property) {
          if (test[entity][index][property] instanceof Array)
            test[entity][index][property] =
              test[entity][index][property].map(toStringOf)
          else if (test[entity][index][property])
            test[entity][index][property] =
              test[entity][index][property].toString()
        })
      })
    }
  })
}

function toYAML(test) {
  normalizeIDs(test)
  return require("js-yaml").dump(test)
}

var EXTENSION_VARIABLES = {
  "openfisca-paris": {
    familles: ["parisien"],
    individus: [],
  },
  "openfisca-france-local": {
    familles: [],
    individus: [],
    menages: [],
  },
}

benefits.forEach((benefit, benefitId, institution) => {
  if (!benefit.computesLocally && institution.repository) {
    const repository = "openfisca-" + institution.repository
    const entity = benefit.entity

    if (!EXTENSION_VARIABLES[repository][entity]) {
      throw `Missing mapping for ${benefitId} in ${repository}/${entity}.`
    }

    EXTENSION_VARIABLES[repository][entity].push(benefitId)
  }
})

function prepareTestSituationForSpecificExtension(situation, extension) {
  forEach(EXTENSION_VARIABLES, function (specificVariables, extensionName) {
    if (extensionName == extension) return

    forEach(specificVariables, function (fieldsToRemove, entityFieldName) {
      forEach(situation[entityFieldName], function (entity) {
        fieldsToRemove.forEach(function (fieldName) {
          delete entity[fieldName]
        })
      })
    })
  })
  return situation
}

var TEST_ATTRIBUTES = [
  "name",
  "description",
  "output",
  "absolute_error_margin",
  "relative_error_margin",
]

exports.generateTest = function generateYAMLTest(details, situation) {
  var openfiscaRequest = mapping.buildOpenFiscaRequest(
    situation.toObject ? situation.toObject() : situation
  )
  var periods = common.getPeriods(situation.dateDeValeur)
  var dropPeriods = [periods.thisMonth].concat(periods.last3Months)

  mapping.giveValueToRequestedVariables(
    openfiscaRequest,
    dropPeriods,
    undefined,
    situation.demandeur
  )
  var testInputs = prepareTestSituationForSpecificExtension(
    openfiscaRequest,
    details.extension
  )

  var testCase = {
    period: periods.thisMonth,
    input: testInputs,
  }

  var result = assign(pick(details, TEST_ATTRIBUTES), testCase)
  return result
}

exports.generateYAMLTest = function generateYAMLTest(details, situation) {
  return toYAML(exports.generateTest(details, situation))
}

exports.EXTENSION_VARIABLES = EXTENSION_VARIABLES
