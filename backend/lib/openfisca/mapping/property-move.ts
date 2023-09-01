import { forEach, pickBy } from "lodash-es"

import common from "./common.js"

import { Property } from "../../../types/properties.js"

const famillePropertiesGivenToIndividu = Object.keys(
  pickBy(common.requestedVariables, function (definition: Property) {
    return (
      (!definition.type || definition.type == "float") &&
      definition.entity == "familles"
    )
  })
).concat(["aeeh", "paje_prepare", "paje_clca"])

const movedProperties = {
  familles: {
    properties: famillePropertiesGivenToIndividu.map(function (id) {
      return { name: id }
    }),
    sourceKeys: ["parents", "enfants"],
  },
  foyers_fiscaux: {
    properties: [{ name: "pensions_alimentaires_versees", sign: -1 }],
    sourceKeys: ["declarants", "personnes_a_charge"],
  },
}

function movePropertyValuesToGroupEntity(testCase) {
  Object.keys(movedProperties).forEach(function (testCasePropertyName) {
    const moveDetails = movedProperties[testCasePropertyName]

    forEach(testCase[testCasePropertyName], function (entity) {
      const entityIndividuIds = moveDetails.sourceKeys.reduce(function (
        accum,
        key
      ) {
        return accum.concat(entity[key] || [])
      },
      [])

      moveDetails.properties.forEach(function (property) {
        const sign = property.sign || 1
        const accum = entityIndividuIds.reduce(function (accum, id) {
          const individu = testCase.individus[id]
          const individuRessource = individu[property.name]
          for (const period in individu[property.name]) {
            if (!accum[period]) accum[period] = 0
            accum[period] = accum[period] + sign * individuRessource[period]
          }
          delete individu[property.name]
          return accum
        }, {})

        // Conditionnally added to match logic of applyRessources
        if (Object.keys(accum).length) {
          entity[property.name] = accum
        }
      })
    })
  })

  return testCase
}

export default { movePropertyValuesToGroupEntity }
