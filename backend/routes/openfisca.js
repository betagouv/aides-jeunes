const { check, validationResult } = require("express-validator")
const openfisca = require("../lib/openfisca/getter")
const openfiscaController = require("../controllers/openfisca")
const { forEach } = require("../../data/all")

let missingBenefits

module.exports = function (api) {
  api.route("/openfisca/missingbenefits").get(async (req, res) => {
    if (missingBenefits) {
      res.json(missingBenefits)
      return
    }

    openfisca.get("/variables", (payload) => {
      let missingValues = []
      forEach((benefit, benefitId) => {
        const source = benefit.openfisca_eligibility_source || benefitId
        if (!benefit.computesLocally && !payload[source]) {
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
