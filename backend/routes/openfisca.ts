import { check, validationResult } from "express-validator"
import openfisca from "../lib/openfisca/getter.js"
import openfiscaController from "../controllers/openfisca.js"
import benefits from "../../data/all.js"
import { Express } from "express"
import { isOpenfiscaBenefit } from "../../lib/benefits/utils.js"

let missingBenefits

export default (api: Express) => {
  api.route("/openfisca/missingbenefits").get(async (req, res) => {
    if (missingBenefits) {
      res.json(missingBenefits)
      return
    }

    openfisca.get("/variables", (payload) => {
      const missingValues = benefits.all
        .filter((benefit) => {
          const source = benefit.openfisca_eligibility_source || benefit.id
          return isOpenfiscaBenefit(benefit) && !payload[source]
        })
        .map((benefit) => {
          return benefit.id
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
