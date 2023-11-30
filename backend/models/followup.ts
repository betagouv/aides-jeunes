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

FollowupSchema.virtual("surveyPathTracker").get(function (this) {
  return `/api/followups/surveys/${this.accessToken}/${SurveyType.TrackClickOnBenefitActionEmail}`
})

FollowupSchema.virtual("wasUsefulPath").get(function (this) {
  return `/api/followups/surveys/${this.accessToken}/${SurveyType.TrackClickOnSimulationUsefulnessEmail}?wasuseful`
})

FollowupSchema.virtual("wasNotUsefulPath").get(function (this) {
  return `/api/followups/surveys/${this.accessToken}/${SurveyType.TrackClickOnSimulationUsefulnessEmail}`
})

export default mongoose.model<Followup, FollowupModel>(
  "Followup",
  FollowupSchema
)
