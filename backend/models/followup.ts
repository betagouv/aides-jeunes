import mongoose from "mongoose"
import validator from "validator"

import { sendMail } from "../lib/smtp.js"

import { Survey } from "../../lib/types/survey.js"
import { SurveyCategory } from "../../lib/enums/survey.js"
import emailRender from "../lib/mes-aides/emails/email-render.js"
import SurveySchema from "./survey-schema.js"
import { EmailCategory } from "../enums/email.js"

import { Followup } from "../../lib/types/followup.d.js"
import { FollowupModel } from "../types/models.d.js"

const FollowupSchema = new mongoose.Schema<Followup, FollowupModel>(
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
  },
  { minimize: false, id: false }
)

FollowupSchema.static("findByEmail", function (email: string) {
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
  return emailRender(EmailCategory.SimulationResults, this)
})

FollowupSchema.method("sendSimulationResultsEmail", function () {
  const followup = this
  return this.renderSimulationResultsEmail()
    .then((render) => {
      return sendMail({
        to: followup.email,
        subject: render.subject,
        text: render.text,
        html: render.html,
        headers: {
          "x-tm-tags": `["${EmailCategory.SimulationResults}"]`,
        },
      })
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

FollowupSchema.method("renderSurveyEmail", function (surveyType) {
  switch (surveyType) {
    case SurveyCategory.TrackClickOnBenefitActionEmail:
      return emailRender(EmailCategory.BenefitAction, this)
    case SurveyCategory.TrackClickOnSimulationUsefulnessEmail:
      return emailRender(EmailCategory.SimulationUsefulness, this)
    case SurveyCategory.TousABordNotification:
      return emailRender(EmailCategory.TousABordNotification, this)
    case SurveyCategory.BenefitAction:
      return Promise.reject(
        new Error(
          `This surveyType "${surveyType}" is not supposed to be sent through an email`
        )
      )
    default:
      return Promise.reject(
        new Error(`This surveyType "${surveyType}" has no email template`)
      )
  }
})

FollowupSchema.method(
  "addSurveyIfMissing",
  async function (type: SurveyCategory) {
    let survey = this.surveys.find((survey) => survey.type === type)
    if (!survey) {
      survey = await this.surveys.create({ type })
      this.surveys.push(survey)
    }
    return survey
  }
)

FollowupSchema.method("sendSurvey", function (surveyType: SurveyCategory) {
  const followup = this
  return this.addSurveyIfMissing(surveyType).then((survey: Survey) => {
    return this.renderSurveyEmail(surveyType)
      .then((render) => {
        return sendMail({
          to: followup.email,
          subject: render.subject,
          text: render.text,
          html: render.html,
          headers: {
            "x-tm-tags": `["survey", "${surveyType}"]`,
          },
        })
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
      .then(() => {
        return followup.save()
      })
  })
})

FollowupSchema.method("updateSurvey", function (type, answers) {
  const surveys: Survey[] = Array.from(this.surveys)
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

FollowupSchema.virtual("emailRenderPath").get(function (this) {
  return `/api/email/followups/${this._id}?token=${this.accessToken}&emailType=`
})

FollowupSchema.virtual("returnPath").get(function (this) {
  return `/followups/${this._id}?token=${this.accessToken}`
})

FollowupSchema.virtual("surveyPath").get(function (this) {
  return `/suivi?token=${this.accessToken}`
})

FollowupSchema.virtual("tousABordNotificationCta").get(function (this) {
  return `/api/followups/surveys/${this.accessToken}/${SurveyCategory.TousABordNotification}`
})

FollowupSchema.virtual("surveyPathTracker").get(function (this) {
  return `/api/followups/surveys/${this.accessToken}/${SurveyCategory.TrackClickOnBenefitActionEmail}`
})

FollowupSchema.virtual("wasUsefulPath").get(function (this) {
  return `/api/followups/surveys/${this.accessToken}/${SurveyCategory.TrackClickOnSimulationUsefulnessEmail}?wasuseful`
})

FollowupSchema.virtual("wasNotUsefulPath").get(function (this) {
  return `/api/followups/surveys/${this.accessToken}/${SurveyCategory.TrackClickOnSimulationUsefulnessEmail}`
})

export default mongoose.model<Followup, FollowupModel>(
  "Followup",
  FollowupSchema
)
