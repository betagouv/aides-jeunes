import lodash from "lodash"
const { forEach, uniq } = lodash

import common from "./common.js"

import { additionalProps } from "./individu/index.js"
import definitions from "../../definitions.js"

function determinePropsToReplicate(entityTypeName, entityDefinition) {
  let filtered = entityDefinition.filter((key) => {
    return key != "id" && !key.startsWith("_")
  })

  if (entityTypeName == "individu") {
    return uniq(filtered.concat(...Object.keys(additionalProps)))
  } else {
    return filtered
  }
}

const types = [
  "famille",
  { type: "foyerFiscal", plural: "foyers_fiscaux" },
  "individu",
  "menage",
]
const forDuplication = types.reduce((accum, type) => {
  const plural = type.type ? type.plural : `${type}s`
  type = type.type ? type.type : type
  accum[plural] = determinePropsToReplicate(type, definitions[type])
  return accum
}, {})

export default function copyTo3PreviousMonths(testCase, dateDeValeur) {
  const periodKeys = [
    "thisMonth",
    "oneMonthAgo",
    "twoMonthsAgo",
    "threeMonthsAgo",
  ]
  const periods = common.getPeriods(dateDeValeur)

  Object.keys(forDuplication).forEach(function (entityName) {
    forDuplication[entityName].forEach(function (entityPropertyName) {
      forEach(testCase[entityName], function (entity) {
        const value = entity[entityPropertyName]
        const result = {}
        if (value !== undefined && typeof value !== "object") {
          periodKeys.forEach(function (periodKey) {
            result[periods[periodKey]] = value
          })
          entity[entityPropertyName] = result
        }
      })
    })
  })
}
