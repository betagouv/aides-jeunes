const common = require("./mapping/common")
const mapping = require("./mapping")
const forEach = require("lodash/forEach")
const assign = require("lodash/assign")
const pick = require("lodash/pick")
const benefits = require("../../../data/all")

function toStringOf(obj) {
  return obj.toString()
}

const ID_PROPERTIES = {
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

const EXTENSION_VARIABLES = {
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

benefits.all.forEach((benefit) => {
  if (!benefit.computesLocally && benefit.institution.repository) {
    const repository = "openfisca-" + benefit.institution.repository
    const entity = benefit.entity

    if (!EXTENSION_VARIABLES[repository][entity]) {
      throw `Missing mapping for ${benefit.slug} in ${repository}/${entity}.`
    }

    EXTENSION_VARIABLES[repository][entity].push(benefit.slug)
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

const TEST_ATTRIBUTES = [
  "name",
  "description",
  "output",
  "absolute_error_margin",
  "relative_error_margin",
]

exports.generateTest = function generateYAMLTest(details, situation) {
  const openfiscaRequest = mapping.buildOpenFiscaRequest(
    situation.toObject ? situation.toObject() : situation
  )
  const periods = common.getPeriods(situation.dateDeValeur)
  const dropPeriods = [periods.thisMonth].concat(periods.last3Months)

  mapping.giveValueToRequestedVariables(
    openfiscaRequest,
    dropPeriods,
    undefined,
    situation.demandeur
  )
  const testInputs = prepareTestSituationForSpecificExtension(
    openfiscaRequest,
    details.extension
  )

  const testCase = {
    period: periods.thisMonth,
    input: testInputs,
  }

  const result = assign(pick(details, TEST_ATTRIBUTES), testCase)
  return result
}

exports.generateYAMLTest = function generateYAMLTest(details, situation) {
  return toYAML(exports.generateTest(details, situation))
}

exports.EXTENSION_VARIABLES = EXTENSION_VARIABLES
