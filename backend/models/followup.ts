import mongoose from "mongoose"
import { sendEmailSmtp } from "../lib/smtp.js"
import { Survey } from "../../lib/types/survey.js"
import { SurveyCategory } from "../../lib/enums/survey.js"
import emailRender from "../lib/mes-aides/emails/email-render.js"
import { EmailCategory, SmsCategory } from "../../lib/enums/messaging.js"
import { Followup } from "../../lib/types/followup.d.js"
import { FollowupModel } from "../types/models.d.js"
import FollowupSchema from "./followup-schema.js"
import { sendEmail } from "../lib/messaging/email/email-service.js"
import { sendSms } from "../lib/messaging/sms/sms-service.js"

FollowupSchema.static("findByEmail", function (email: string) {
  return this.find({ email })
})

FollowupSchema.method("renderSimulationResultsEmail", function () {
  return emailRender(EmailCategory.SimulationResults, this)
})

FollowupSchema.method("sendSimulationResultsEmail", async function () {
  try {
    return await sendEmail(EmailCategory.SimulationResults, this)
  } catch (err) {
    console.log("error", err)
    this.error = JSON.stringify(err, null, 2)
    return this.save()
  }
})

FollowupSchema.method("sendSimulationResultsSms", async function () {
  try {
    return await sendSms(SmsCategory.SimulationResults, this)
  } catch (err) {
    this.smsError = JSON.stringify(err, null, 2)
    throw err
  }
})

FollowupSchema.method("sendBenefitActionSms", async function () {
  try {
    return await sendSms(SmsCategory.InitialSurvey, this)
  } catch (err) {
    this.smsSurveyError = JSON.stringify(err, null, 2)
    throw err
  }
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

FollowupSchema.method(
  "sendSurveyByEmail",
  async function (surveyType: SurveyCategory) {
    const followup = this
    let survey
    try {
      survey = await this.addSurveyIfMissing(surveyType)
      const render = await this.renderSurveyEmail(surveyType)
      const response = await sendEmailSmtp({
        to: followup.email,
        subject: render.subject,
        text: render.text,
        html: render.html,
        tags: ["survey", surveyType],
      })

      survey.messageId = response.messageId
    } catch (err) {
      console.error("error", err)
      survey.error = err
      throw err
    } finally {
      await followup.save()
    }
    return survey
  }
)

FollowupSchema.method(
  "sendSurveyBySms",
  async function (surveyType: SurveyCategory) {
    const followup = this
    let survey: Survey | undefined
    try {
      survey = await this.addSurveyIfMissing(surveyType)
      await this.sendBenefitActionSms(surveyType)
      await followup.save()
      return survey
    } catch (err) {
      console.error("error", err)
      if (survey) {
        survey.error = err
        return survey
      } else {
        return err
      }
    }
  }
)

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
