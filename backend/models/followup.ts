import mongoose from "mongoose"
import { find } from "lodash"
import validator from "validator"

import { SendSmtpEmail, sendEmail } from "../lib/send-in-blue"
import utils from "../lib/utils"

import { SurveyLayout } from "../types/survey"

import renderInitial from "../lib/mes-aides/emails/initial"
import renderSurvey from "../lib/mes-aides/emails/survey"

import { MongooseLayout, FollowupModel } from "../types/models"

const SurveySchema = new mongoose.Schema<MongooseLayout, FollowupModel>(
  {
    _oldId: { type: String },
    accessToken: { type: String },
    createdAt: { type: Date, default: Date.now },
    messageId: { type: String },
    repliedAt: { type: Date },
    error: { type: Object },
    answers: [
      {
        id: String,
        value: String,
        comments: String,
      },
    ],
    type: { type: String },
  },
  { minimize: false, id: false }
)

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
