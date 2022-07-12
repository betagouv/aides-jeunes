import express from "express"
import { followup, resultRedirect } from "./controllers/followups.js"

// Setup Express
const app = express()
const router = express.Router()

router.param("followupId", followup)
router.get("/:followupId", resultRedirect)

if (app.get("env") === "development") {
  router.get("/:followupId/initial.html", (req, res) => {
    req.followup.renderInitialEmail().then((render) => res.send(render.html))
  })
  router.get("/:followupId/survey.html", (req, res) => {
    req.followup
      .renderSurveyEmail({ returnPath: "/returnPath" })
      .then((render) => res.send(render.html))
  })
}
app.use(router)

module.exports = app
