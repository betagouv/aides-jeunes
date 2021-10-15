var openfisca = require("../lib/openfisca")
var { forEach } = require("../../app/js/constants/benefits/back")

let missingBenefits

module.exports = function (api) {
  api.route("/openfisca/parameters/:parameterId").get((req, res) => {
    return openfisca.get(`/parameter/${req.params.parameterId}`, (payload) =>
      res.send(payload)
    )
  })

  api.route("/openfisca/verifybenefits").get(async (req, res) => {
    if (missingBenefits) {
      res.json(missingBenefits)
    }

    openfisca.get("/variables", (payload) => {
      let missingValues = []
      forEach((benefit, benefitId) => {
        const source = benefit.openfisca_eligibility_source || benefitId
        if (!benefit.test && !benefit.computesLocally && !payload[source]) {
          missingValues.push(benefitId)
        }
      })
      res.json(missingValues)
      missingBenefits = missingValues
    })
  })
}
