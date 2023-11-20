import mongoose from "mongoose"
import axios from "axios"
import { Survey } from "../../lib/types/survey.js"
import { SurveyCategory } from "../../lib/enums/survey.js"
import config from "../config/index.js"
import { Followup } from "../../lib/types/followup.d.js"
import { FollowupModel } from "../types/models.d.js"
import { phoneNumberFormatting } from "../../lib/phone-number.js"
import FollowupSchema from "./followup-schema.js"

FollowupSchema.static("findByEmail", function (email: string) {
  return this.find({ email })
})

FollowupSchema.method("postSimulationResultsSms", function (messageId) {
  this.smsSentAt = Date.now()
  this.smsMessageId = messageId
  if (!this.surveyOptin) {
    this.phone = undefined
  }
  this.smsError = undefined
  return this.save()
})

FollowupSchema.method(
  "renderSimulationResultsSmsUrl",
  function (username: string, password: string) {
    const { baseURL } = config
    const { url } = config.smsService
    const { accessToken, phone } = this
    const formattedPhone = phoneNumberFormatting(
      phone,
      config.smsService.internationalDiallingCodes
    )

    const text = `Bonjour\nRetrouvez les résultats de votre simulation ici ${baseURL}/api/sms/${accessToken}\n1jeune1solution`
    const encodedText = encodeURIComponent(text)

    return `${url}?&originatorTON=1&originatingAddress=SIMUL 1J1S&destinationAddress=${formattedPhone}&messageText=${encodedText}&username=${username}&password=${password}`
  }
)

FollowupSchema.method("sendSimulationResultsSms", async function () {
  try {
    const username = config.smsService.username
    const password = config.smsService.password
    if (!username || !password) {
      throw new Error("Missing SMS service credentials")
    }
    const renderUrl = this.renderSimulationResultsSmsUrl(username, password)
    const axiosInstance = axios.create({
      timeout: 10000,
    })
    const { data, status } = await axiosInstance.get(renderUrl)
    if (status !== 200 || data.responseCode !== 0) {
      throw new Error(`SMS request failed. Body: ${JSON.stringify(data)}`)
    }
    return this.postSimulationResultsSms(data.messageIds[0])
  } catch (err) {
    this.smsError = JSON.stringify(err, null, 2)
    throw err
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
