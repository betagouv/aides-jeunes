var { check, validationResult } = require("express-validator")
var openfisca = require("../lib/openfisca")
var { forEach } = require("../../app/js/constants/benefits/back")

let missingBenefits

module.exports = function (api) {
  api.route("/openfisca/missingbenefits").get(async (req, res) => {
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

  api
    .route("/openfisca/parameters/:date")
    .get([check("date").isISO8601()], async (req, res) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.status(400).send("Invalid date")
        return
      }

      const parameters = await openfiscaController.getParameters(
        new Date(req.params.date)
      )
      res.json(parameters)
    })
}
