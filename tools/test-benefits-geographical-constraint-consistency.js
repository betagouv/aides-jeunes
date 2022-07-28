"use strict"
exports.__esModule = true
var all_js_1 = require("../data/all.js")
all_js_1["default"].all
  .filter(function (benefit) {
    return (
      ["region", "departement", "commune", "epci"].includes(
        benefit.institution.type
      ) && benefit.source === "javascript"
    )
  })
  .forEach(function (benefit) {
    var result = testGeographicalRelevancy(benefit)
    if (!(result === null || result === void 0 ? void 0 : result.isValid)) {
      console.log("================================")
      console.log("Benefit : " + benefit.id)
      console.log("Insee code : " + benefit.institution.code_insee)
      console.log("potentially incompatible with conditions :")
      console.log(
        result === null || result === void 0 ? void 0 : result.conditions
      )
    }
  })
function testGeographicalRelevancy(benefit) {
  var conditionGeo = benefit.conditions_generales.find(function (condition) {
    return (
      condition.type === "regions" ||
      condition.type === "departements" ||
      condition.type === "communes" ||
      condition.type === "epcis"
    )
  })
  if (conditionGeo) {
    return {
      isValid:
        conditionGeo.values.length == 1 &&
        conditionGeo.values[0] === benefit.institution.code_insee &&
        conditionGeo.type.slice(0, -1) === benefit.institution.type,
      conditions: conditionGeo,
    }
  }
}
module.exports = {
  testGeographicalRelevancy: testGeographicalRelevancy,
}
