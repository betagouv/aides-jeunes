const forEach = require("lodash/forEach")
const uniq = require("lodash/uniq")

const common = require("./common")

const { additionalProps } = require("./individu")
const definitions = require("../../definitions")

function determinePropsToReplicate(entityTypeName, entityDefinition) {
  let keyList = Object.keys(entityDefinition)

  let filtered = keyList.filter((key) => {
    let type = entityDefinition[key].type || entityDefinition[key]
    return (
      key != "id" &&
      !key.startsWith("_") &&
      typeof type == "function" &&
      type != Object
    )
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
  const plural = type.type ? type.plural : type + "s"
  type = type.type ? type.type : type
  accum[plural] = determinePropsToReplicate(type, definitions[type])
  return accum
}, {})

function copyTo3PreviousMonths(testCase, dateDeValeur) {
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

module.exports = copyTo3PreviousMonths
