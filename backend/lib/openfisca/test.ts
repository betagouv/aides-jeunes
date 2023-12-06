import common from "./mapping/common.js"
import mapping from "./mapping/index.js"
import { forEach, assign, pick, pickBy } from "lodash-es"
import benefits from "../../../data/all.js"
import { filterByInterestFlag } from "../../../lib/benefits/filter-interest-flag.js"
import jsYaml from "js-yaml"

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
  return jsYaml.dump(test)
}

export const EXTENSION_VARIABLES = {
  "openfisca-paris": {
    familles: ["parisien"],
    individus: [],
  },
  "openfisca-france-local": {
    familles: [],
    individus: ["sous_contrat_engagement_jeune"],
    menages: [],
  },
}

benefits.all
  .filter(
    (benefit) =>
      benefit.source === "openfisca" && benefit.institution.repository
  )
  .forEach((benefit) => {
    const repository = `openfisca-${benefit.institution.repository}`
    const entity = benefit.entity

    if (!EXTENSION_VARIABLES[repository][entity]) {
      throw `Missing mapping for ${benefit.id} in ${repository}/${entity}.`
    }

    EXTENSION_VARIABLES[repository][entity].push(benefit.id)
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

export const generateTest = function (details, situation) {
  const openfiscaRequest = mapping.buildOpenFiscaRequest(
    situation.toObject ? situation.toObject() : situation
  )
  const periods = common.getPeriods(situation.dateDeValeur)

  const prestationsWithInterest: Record<string, any> = pickBy(
    common.requestedVariables,
    function (definition) {
      return filterByInterestFlag(definition, situation.demandeur)
    }
  )

  const openfiscaPeriods: Set<string> = new Set()
  Object.values(prestationsWithInterest).forEach((definition) => {
    openfiscaPeriods.add(definition.openfiscaPeriod)
  })

  openfiscaPeriods.forEach((value) => {
    const prestations = pickBy(prestationsWithInterest, function (definition) {
      return definition.openfiscaPeriod === value
    })

    mapping.giveValueToRequestedVariables(
      openfiscaRequest,
      prestations,
      periods[value],
      undefined
    )
  })

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

export function generateYAMLTest(details, situation) {
  return toYAML(generateTest(details, situation))
}

export default {
  EXTENSION_VARIABLES,
  generateTest,
  generateYAMLTest,
}
