import express from "express"
import { followup, resultRedirect } from "./controllers/followups"
import { ajRequest } from "./types/express"

// Setup Express
const app = express()
const router = express.Router()

router.param("followupId", followup)
router.get("/:followupId", resultRedirect)

if (app.get("env") === "development") {
  router.get("/:followupId/initial.html", (req: ajRequest, res) => {
    req.followup
      .renderInitialEmail()
      .then((render: any) => res.send(render.html))
  })
  router.get("/:followupId/survey.html", (req: ajRequest, res) => {
    req.followup
      .renderSurveyEmail({ returnPath: "/returnPath" })
      .then((render: any) => res.send(render.html))
  })
}
app.use(router)

export default app
