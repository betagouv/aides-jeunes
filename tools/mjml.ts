#!/usr/bin/env node

import api from "../backend/api.js"
import { EmailCategory } from "../backend/enums/email.js"
import express from "express"
import Followups from "../backend/models/followup.js"
import emailRender from "../backend/lib/mes-aides/emails/email-render.js"
import { SurveyType } from "../lib/enums/survey.js"
import { __express } from "ejs"
import "../backend/lib/mongo-connector.js"
import Request from "../backend/types/express.d.js"
import { Followup } from "../lib/types/followup.d.js"

api()

const port = process.env.PORT || 9001

// Setup Express
const app = express()

const typeKeys = EmailCategory

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
  const emailType = req.params.type as EmailCategory
  let surveyType: SurveyType | undefined

  switch (emailType) {
    case EmailCategory.SimulationResults:
      return emailRender(EmailCategory.SimulationResults, followup)
    case EmailCategory.SimulationUsefulness:
      surveyType = SurveyType.trackClickOnSimulationUsefulnessEmail
      break
    case EmailCategory.BenefitAction:
      surveyType = SurveyType.trackClickOnBenefitActionEmail
      break
    default:
      return {
        html: `Failed to render email, unknown email type: ${emailType}`,
      }
  }

  await followup.addSurveyIfMissing(surveyType)
  await followup.save()
  return followup.renderSurveyEmail(surveyType)
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
