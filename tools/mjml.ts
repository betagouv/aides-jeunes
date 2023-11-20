#!/usr/bin/env node

import mongoose from "mongoose"
import configMongoose from "../backend/config/mongoose.js"
import config from "../backend/config/index.js"
import { EmailType } from "../lib/enums/messaging.js"
import express from "express"
import Followups from "../backend/models/followup.js"
// To load the simulation model in mongoose
import "../backend/models/simulation.js"
import {
  emailRender,
  emailRenderBySurveyType,
} from "../backend/lib/mes-aides/emails/email-render.js"
import { SurveyType } from "../lib/enums/survey.js"
import { __express } from "ejs"
import "../backend/lib/mongo-connector.js"
import Request from "../backend/types/express.d.js"
import { Followup } from "../lib/types/followup.d.js"

configMongoose(mongoose, config)

const port = process.env.PORT || 9001

// Setup Express
const app = express()

const typeKeys = EmailType

app.engine(".html", __express)
app.set("views", new URL(".", import.meta.url).pathname + "/views")
app.set("view engine", "html")

app.route("/").get(function (req, res) {
  Followups.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .exec(function (err, followups) {
      res.render("index", {
        followups,
        typeKeys,
      })
    })
})

const followupRendering = async (req: Request) => {
  const { followup } = req
  const emailType = req.params.type as EmailType
  let surveyType: SurveyType | undefined

  switch (emailType) {
    case EmailType.SimulationResults:
      return emailRender(EmailType.SimulationResults, followup)
    case EmailType.SimulationUsefulness:
      surveyType = SurveyType.TrackClickOnSimulationUsefulnessEmail
      break
    case EmailType.BenefitAction:
      surveyType = SurveyType.TrackClickOnBenefitActionEmail
      break
    default:
      return {
        html: `Failed to render email, unknown email type: ${emailType}`,
      }
  }

  await followup.addSurveyIfMissing(surveyType)
  await followup.save()
  return emailRenderBySurveyType(surveyType, followup)
}

app.route("/mjml/:id/:type").get(
  function (req, res, next) {
    Followups.findById(req.params.id)
      .populate("simulation")
      .exec(function (err, followup: Followup | null) {
        if (err) {
          return next(err)
        }

        if (!followup) {
          return next()
        }

        req.followup = followup
        next()
      })
  },
  function (req, res) {
    followupRendering(req).then((result) => {
      const mode = req.query.mode || "html"
      if (!result) {
        throw new Error("Failed to render email")
      }
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
