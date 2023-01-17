import mongoose from "mongoose"
import validator from "validator"

import { SendSmtpEmail, sendEmail } from "../lib/send-in-blue"
import utils from "../lib/utils"

import { SurveyLayout, SurveyType } from "../types/survey"

import renderSimulationResults from "../lib/mes-aides/emails/simulation-results"
import renderSimulationUsefulnessSurvey from "../lib/mes-aides/emails/simulation-usefulness-survey"
import renderBenefitActionSurvey from "../lib/mes-aides/emails/benefit-action-survey"
import SurveySchema from "./survey-schema"
import { MongooseLayout, FollowupModel } from "../types/models"

const FollowupSchema = new mongoose.Schema(
  {
    simulation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Simulation",
    },
    email: {
      type: String,
      validate: {
        validator: validator.isEmail,
        message: "{VALUE} n'est pas un email valide",
        isAsync: false,
      },
    },
    createdAt: { type: Date, default: Date.now },
    sentAt: { type: Date },
    messageId: { type: String },
    surveySentAt: { type: Date },
    benefits: { type: Object },
    surveyOptin: { type: Boolean, default: false },
    surveys: {
      type: [SurveySchema],
      default: [],
    },
    version: Number,
    error: { type: Object },
    accessToken: { type: String },
    _oldId: { type: String },
  },
  { minimize: false, id: false }
)

FollowupSchema.static("findByIdOrOldId", function (id) {
  if (id.length === 24) {
    return this.findById(id)
  } else {
    return this.findOne({ _oldId: id })
  }
})

FollowupSchema.static("findByEmail", function (email) {
  return this.find({ email })
})
FollowupSchema.method("postSimulationResultsEmail", function (messageId) {
  this.sentAt = Date.now()
  this.messageId = messageId
  if (!this.surveyOptin) {
    this.email = undefined
  }
  this.error = undefined
  return this.save()
})

FollowupSchema.method("renderSimulationResultsEmail", function () {
  return renderSimulationResults(this)
})

FollowupSchema.method("sendSimulationResultsEmail", function () {
  const followup = this
  return this.renderSimulationResultsEmail()
    .then((render) => {
      const email = new SendSmtpEmail()
      email.to = [{ email: followup.email }]
      email.subject = render.subject
      email.textContent = render.text
      email.htmlContent = render.html
      email.tags = ["simulation-results"]
      return sendEmail(email)
    })
    .then((response) => {
      return followup.postSimulationResultsEmail(response.messageId)
    })
    .catch((err) => {
      console.log("error", err)
      followup.error = JSON.stringify(err, null, 2)
      return followup.save()
    })
})

FollowupSchema.method("renderSurveyEmail", function (survey) {
  switch (survey.type) {
    case "benefit-action":
      return renderBenefitActionSurvey(this)
    case "simulation-usefulness":
      return renderSimulationUsefulnessSurvey(this)
    default:
      return Promise.reject(new Error("Unknown email type"))
  }
})

FollowupSchema.method("createSurvey", function (type: SurveyType) {
  return Promise.resolve(
    this.surveys.create({
      type,
    })
  )
})

FollowupSchema.method("sendSurvey", function (surveyType: SurveyType) {
  const followup = this
  return this.createSurvey(surveyType).then((survey: SurveyLayout) => {
    return this.renderSurveyEmail(survey)
      .then((render) => {
        const email = new SendSmtpEmail()
        email.to = [{ email: followup.email }]
        email.subject = render.subject
        email.textContent = render.text
        email.htmlContent = render.html
        email.tags = ["survey", surveyType]
        return sendEmail(email)
          .then((response) => {
            return response.messageId
          })
          .then((messageId) => {
            survey.messageId = messageId
            return survey
          })
      })
      .catch((err: Error) => {
        console.log("error", err)
        survey.error = err
        return survey
      })
      .then((survey) => {
        const surveys = Array.from(followup.surveys)
        surveys.push(survey)

        followup.surveys = surveys
        return followup.save()
      })
  })
})

FollowupSchema.method("mock", function () {
  const followup = this
  return this.createSurvey("benefit-action").then((survey) => {
    const surveys = Array.from(followup.surveys)
    surveys.push(survey)
    followup.surveys = surveys
    return followup.save()
  })
})

FollowupSchema.method("updateSurvey", function (type, answers) {
  const surveys: SurveyLayout[] = Array.from(this.surveys)
  const survey = surveys.find((s) => s.type === type)
  if (typeof survey === "undefined") {
    console.log("Could not find and update survey using its id")
    return
  }
  Object.assign(survey, {
    answers: answers,
    repliedAt: Date.now(),
  })
  this.surveys = surveys
  return this.save()
})

FollowupSchema.pre("save", async function (next) {
  if (!this.isNew) {
    return next()
  }
  try {
    const followup = this
    followup.version = 3
    followup.accessToken = await utils.generateToken()
    next()
  } catch {
    next()
  }
})

FollowupSchema.virtual("returnPath").get(function (this: any) {
  return `/followups/${this._id}?token=${this.accessToken}`
})

FollowupSchema.virtual("surveyPath").get(function (this: any) {
  return `/suivi?token=${this.accessToken}`
})

FollowupSchema.virtual("wasUsefulPath").get(function (this: any) {
  return `/api/followups/surveys/${this.accessToken}/wasuseful/1`
})

FollowupSchema.virtual("wasNotUsefulPath").get(function (this: any) {
  return `/api/followups/surveys/${this.accessToken}/wasuseful/0`
})

export default mongoose.model<MongooseLayout, FollowupModel>(
  "Followup",
  FollowupSchema
)
