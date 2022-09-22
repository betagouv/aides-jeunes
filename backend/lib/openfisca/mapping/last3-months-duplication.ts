import { forEach, uniq } from "lodash"

import common from "./common"

import { additionalProps } from "./individu/index"
import definitions from "../../definitions"

function determinePropsToReplicate(entityTypeName, entityDefinition) {
  const filtered = entityDefinition.filter((key) => {
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
  const plural =
    typeof type === "object" && type?.type ? type.plural : `${type}s`
  type = typeof type === "object" && type?.type ? type.type : `${type}`
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
