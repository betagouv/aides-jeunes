import mongoose from "mongoose"
import { find } from "lodash-es"
import validator from "validator"

import { SendSmtpEmail, sendEmail } from "../lib/send-in-blue.js"
import utils from "../lib/utils.js"

import { SurveyLayout } from "../types/survey.js"

import renderInitial from "../lib/mes-aides/emails/initial.js"
import renderSurvey from "../lib/mes-aides/emails/survey.js"

import { MongooseLayout, FollowupModel } from "../types/models.js"

const SurveySchema = new mongoose.Schema<MongooseLayout, FollowupModel>(
  {
    _oldId: { type: String },
    accessToken: { type: String },
    answers: [
      {
        comments: String,
        id: String,
        value: String,
      },
    ],
    createdAt: { default: Date.now, type: Date },
    error: { type: Object },
    messageId: { type: String },
    repliedAt: { type: Date },
    type: { type: String },
  },
  { id: false, minimize: false }
)

const FollowupSchema = new mongoose.Schema(
  {
    _oldId: { type: String },
    accessToken: { type: String },
    benefits: { type: Object },
    createdAt: { default: Date.now, type: Date },
    email: {
      type: String,
      validate: {
        isAsync: false,
        message: "{VALUE} n'est pas un email valide",
        validator: validator.isEmail,
      },
    },
    error: { type: Object },
    messageId: { type: String },
    sentAt: { type: Date },
    simulation: {
      ref: "Simulation",
      type: mongoose.Schema.Types.ObjectId,
    },
    surveyOptin: { default: false, type: Boolean },
    surveys: {
      default: [],
      type: [SurveySchema],
    },
    surveySentAt: { type: Date },
    version: Number,
  },
  { id: false, minimize: false }
)

FollowupSchema.static("findByIdOrOldId", function (id) {
  if (id.length === 24) {
    return this.findById(id)
  } else {
    return this.findOne({ _oldId: id })
  }
})

FollowupSchema.method("postInitialEmail", function (messageId) {
  this.sentAt = Date.now()
  this.messageId = messageId
  if (!this.surveyOptin) {
    this.email = undefined
  }
  this.error = undefined
  return this.save()
})

FollowupSchema.method("renderInitialEmail", function () {
  return renderInitial(this)
})

FollowupSchema.method("sendInitialEmail", function () {
  const followup = this
  return this.renderInitialEmail()
    .then((render) => {
      const email = new SendSmtpEmail()
      email.to = [{ email: followup.email }]
      email.subject = render.subject
      email.textContent = render.text
      email.htmlContent = render.html
      email.tags = ["initial"]
      return sendEmail(email)
    })
    .then((response) => {
      return followup.postInitialEmail(response.messageId)
    })
    .catch((err) => {
      console.log("error", err)
      followup.error = JSON.stringify(err, null, 2)
      return followup.save()
    })
})

FollowupSchema.method("renderSurveyEmail", function (survey) {
  return renderSurvey(survey)
})

FollowupSchema.method("createSurvey", function (type) {
  return Promise.resolve(
    this.surveys.create({
      type: type,
    })
  )
})

FollowupSchema.method("sendSurvey", function () {
  const followup = this
  return this.createSurvey("initial").then((survey: SurveyLayout) => {
    return this.renderSurveyEmail(followup)
      .then((render) => {
        const email = new SendSmtpEmail()
        email.to = [{ email: followup.email }]
        email.subject = render.subject
        email.textContent = render.text
        email.htmlContent = render.html
        email.tags = ["survey"]
        return sendEmail(email)
          .then((response) => {
            return response.messageId
          })
          .then((messageId) => {
            survey.messageId = messageId
            return survey
          })
      })
      .catch((err) => {
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
  return this.createSurvey("initial").then((survey) => {
    const surveys = Array.from(followup.surveys)
    surveys.push(survey)
    followup.surveys = surveys
    return followup.save()
  })
})

FollowupSchema.method("updateSurvey", function (id, answers) {
  const surveys: SurveyLayout[] = Array.from(this.surveys)
  const survey = find(surveys, function (s: SurveyLayout) {
    return s._id === id
  })
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
    followup.version = 2
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

export default mongoose.model<MongooseLayout, FollowupModel>(
  "Followup",
  FollowupSchema
)
