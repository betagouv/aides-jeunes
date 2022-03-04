const express = require("express")
const followups = require("./controllers/followups")

// Setup Express
const app = express()

const router = new express.Router()

router.param("followupId", followups.followup)
// next line to be removed once token are used globally
router.get("/:followupId", followups.resultRedirect)
router.get("/:followupId/:token", followups.resultRedirect)

if (app.get("env") === "development") {
  router.get("/:followupId/initial.html", function (req, res) {
    req.followup.renderInitialEmail().then((render) => res.send(render.html))
  })
  router.get("/:followupId/survey.html", function (req, res) {
    req.followup
      .renderSurveyEmail({ returnPath: "/returnPath" })
      .then((render) => res.send(render.html))
  })
}
app.use(router)

module.exports = app
