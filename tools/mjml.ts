#!/usr/bin/env node

import express from "express"

import api from "../backend/api"
api()
import "../backend/lib/mongo-connector"
import Followup from "../backend/models/followup"
import renderSimulationResults from "../backend/lib/mes-aides/emails/simulation-results"
import "../backend/lib/mes-aides/emails/simulation-usefulness-survey"
import "../backend/lib/mes-aides/emails/benefit-action-survey"

const port = process.env.PORT || 9001

// Setup Express
const app = express()

const typeKeys = [
  "simulation-results",
  "simulation-usefulness-survey",
  "benefit-action-survey",
]

app.engine(".html", require("ejs").__express)
app.set("views", __dirname + "/views")
app.set("view engine", "html")

app.route("/").get(function (req, res) {
  Followup.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .exec(function (err, followups) {
      res.render("index", {
        followups,
        typeKeys,
      })
    })
})

app.route("/mjml/:id/:type").get(function (req, res) {
  Followup.findByIdOrOldId(req.params.id)
    .populate("simulation")
    .exec(function (err, followup) {
      let p = {}
      const survey = followup.surveys.find((s) =>
        req.params.type.includes(s.type)
      )
      if (req.params.type == "simulation-results") {
        p = renderSimulationResults(followup)
      } else if (
        req.params.type == "simulation-usefulness-survey" ||
        req.params.type == "benefit-action-survey"
      ) {
        p = followup
          .createSurvey("benefit-action")
          .then(() => followup.renderSurveyEmail(survey))
      }
      if (p instanceof Promise) {
        p.then(function (result) {
          const mode = req.query.mode || "html"
          if (mode == "html") {
            res.send(result[mode])
          } else {
            res
              .set({ "Content-Type": "text/plain" })
              .send(result[mode as string])
          }
        })
      }
    })
})

// Start server
app.listen(port, function () {
  console.log(
    `Mes Aides MJML preview server listening on port ${port}, in ${app.get(
      "env"
    )} mode, http://localhost:${port}`
  )
})

export default app
