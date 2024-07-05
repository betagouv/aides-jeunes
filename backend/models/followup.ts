import mongoose from "mongoose"
import { Survey } from "../../lib/types/survey.js"
import { SurveyType } from "../../lib/enums/survey.js"
import { Followup } from "../../lib/types/followup.d.js"
import { FollowupModel } from "../types/models.d.js"
import FollowupSchema from "./followup-schema.js"

FollowupSchema.static("findByEmail", function (email: string) {
  return this.find({ email })
})

FollowupSchema.method(
  "addSurveyIfMissing",
  async function (surveyType: SurveyType): Promise<Survey> {
    let survey = this.surveys.find((survey) => survey.type === surveyType)
    if (!survey) {
      survey = await this.surveys.create({ type: surveyType })
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
  const now = Date.now()
  Object.assign(survey, {
    answers: answers,
    repliedAt: now,
    touchedAts: [...survey.touchedAts, now],
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

FollowupSchema.virtual("recapPath").get(function (this) {
  return `${this.returnPath}&to=/recapitulatif`
})

FollowupSchema.virtual("shortResultPath").get(function (this) {
  return `/s/r/${this.accessToken}`
})

FollowupSchema.virtual("surveyPath").get(function (this) {
  return `/suivi?token=${this.accessToken}`
})

FollowupSchema.virtual("surveyPathTracker").get(function (this) {
  return `/api/followups/surveys/${this.accessToken}/${SurveyType.TrackClickOnSimulationUsefulnessEmail}`
})

FollowupSchema.virtual("wasUsefulPath").get(function (this) {
  return `/api/followups/surveys/${this.accessToken}/${SurveyType.TrackClickOnSimulationUsefulnessEmail}?wasuseful`
})

FollowupSchema.virtual("wasNotUsefulPath").get(function (this) {
  return `/api/followups/surveys/${this.accessToken}/${SurveyType.TrackClickOnSimulationUsefulnessEmail}`
})

FollowupSchema.virtual("shortSurveyPath").get(function (this) {
  return `/s/s/${this.accessToken}`
})

FollowupSchema.virtual("smsSurveyPath").get(function (this) {
  return `/api/followups/surveys/${this.accessToken}/${SurveyType.TrackClickOnBenefitActionSms}`
})

FollowupSchema.virtual("shortRecapPath").get(function (this) {
  return `/s/t/${this.accessToken}`
})

FollowupSchema.virtual("recapSurveyPath").get(function (this) {
  return `/api/followups/surveys/${this.accessToken}/${SurveyType.TrackClickTemporarySimulationLink}`
})

export default mongoose.model<Followup, FollowupModel>(
  "Followup",
  FollowupSchema
)
