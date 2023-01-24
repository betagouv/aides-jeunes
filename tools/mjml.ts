#!/usr/bin/env node

import express from "express"

import api from "../backend/api"
api()
import "../backend/lib/mongo-connector"
import Followup from "../backend/models/followup"
import renderSimulationResults from "../backend/lib/mes-aides/emails/simulation-results"
import { SurveyType } from "../backend/types/survey"
import { ajRequest } from "../backend/types/express"
import "../backend/lib/mes-aides/emails/benefit-action"
import { __express } from "ejs"
const port = process.env.PORT || 9001

// Setup Express
const app = express()

const typeKeys = [
  "simulation-results",
  "simulation-usefulness",
  "benefit-action",
]

app.engine(".html", __express)
app.set("views", new URL(".", import.meta.url).pathname + "/views")
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

const followupRendering = (req) => {
  const followup = req.followup
  if (req.params.type == "simulation-results") {
    return renderSimulationResults(followup)
  }
  const surveyType: SurveyType = req.params.type
  const survey = followup.surveys.find((s) => surveyType === s.type)
  if (!survey) {
    return followup
      .createSurvey(surveyType)
      .then((survey) => followup.surveys.push(survey))
      .then(() => followup.save())
      .then(() => {
        return followup.renderSurveyEmail(surveyType)
      })
  } else {
    return followup.renderSurveyEmail(surveyType)
  }
}

app.route("/mjml/:id/:type").get(
  function (req: ajRequest, res, next) {
    Followup.findByIdOrOldId(req.params.id)
      .populate("simulation")
      .exec(function (err, followup) {
        if (err) {
          return next(err)
        }
        req.followup = followup
        next()
      })
  },
  function (req, res) {
    followupRendering(req).then((result) => {
      const mode = req.query.mode || "html"
      if (mode == "html") {
        res.send(result[mode])
      } else {
        res.set({ "Content-Type": "text/plain" }).send(result[mode as string])
      }
    })
  }
)

// Start server
app.listen(port, function () {
  console.log(
    `Mes Aides MJML preview server listening on port ${port}, in ${app.get(
      "env"
    )} mode, http://localhost:${port}`
  )
})

export default app
