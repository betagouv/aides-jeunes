import express from "express"
import { followup, resultRedirect } from "./controllers/followups"
import { ajRequest } from "./types/express"

// Setup Express
const app = express()
const router = express.Router()

router.param("followupId", followup)
router.get("/:followupId", resultRedirect)

if (app.get("env") === "development") {
  router.get("/:followupId/simulation-results.html", (req: ajRequest, res) => {
    req.followup
      .renderSimulationResultsEmail()
      .then((render: any) => res.send(render.html))
  })
  router.get(
    "/:followupId/benefit-action-survey.html",
    (req: ajRequest, res) => {
      req.followup
        .renderBenefitActionSurveyEmail({ returnPath: "/returnPath" })
        .then((render: any) => res.send(render.html))
    }
  )
}
app.use(router)

export default app
