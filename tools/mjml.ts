#!/usr/bin/env node

import { ajRequest } from "../backend/types/express.d.js"
import api from "../backend/api"
import { EmailType } from "../backend/types/email.d"

import express from "express"
import Followup from "../backend/models/followup"
import renderSimulationResults from "../backend/lib/mes-aides/emails/simulation-results"
import { SurveyType } from "../backend/types/survey.d"
import "../backend/lib/mes-aides/emails/benefit-action"
import { __express } from "ejs"
import "../backend/lib/mongo-connector"

api()

const port = process.env.PORT || 9001

// Setup Express
const app = express()

const typeKeys = EmailType

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
  let surveyType: SurveyType = req.params.type
  switch (req.params.type) {
    case EmailType.simulationResults:
      return renderSimulationResults(followup)
    case EmailType.simulationUsefulness:
      surveyType = SurveyType.trackClicSimulationUsefulnessEmail
      break
  }
  const survey = followup.surveys.find((s) => surveyType === s.type)
  if (!survey) {
    return followup
      .addSurveyIfNecessary(surveyType)
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
