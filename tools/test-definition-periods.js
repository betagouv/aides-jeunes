const {
  requestedVariables,
} = require("../backend/lib/openfisca/mapping/common")
const { get } = require("../backend/lib/openfisca/getter")
const assert = require("assert")

const openfiscaPeriodToDefinitionPeriod = {
  thisMonth: "MONTH",
  thisYear: "YEAR",
  fiscalYear: "YEAR",
}

const openfiscaPromise = []
Object.keys(requestedVariables).forEach((variableId) => {
  openfiscaPromise.push(
    get(`/variable/${variableId}`, (data) => {
      const definitionPeriod =
        openfiscaPeriodToDefinitionPeriod[
          requestedVariables[variableId].openfiscaPeriod
        ]
      assert(definitionPeriod === data.definitionPeriod)
    })
  )
})
Promise.all(openfiscaPromise).then(() => console.log("Test done"))
