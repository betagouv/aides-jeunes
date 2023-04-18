import { EmailType } from "../../enums/email.js"
import { SurveyType } from "../../../lib/enums/survey.js"
import Followup, { FollowupInterface } from "../../models/followup.js"

async function sendMultipleEmails(emailType, limit) {
  if (emailType !== "initial-survey") {
    throw new Error("Multiple emails can only be sent for initial survey")
  }

  const followups = await Followup.find({
    surveys: { $size: 0 },
    sentAt: {
      $lt: new Date(new Date().getTime() - 6.5 * 24 * 60 * 60 * 1000),
    },
    surveyOptin: true,
  })
    .sort({ createdAt: 1 })
    .limit(limit)

  const results = await Promise.all(
    followups.map(async (followup) => {
      const surveyType =
        Math.random() > 0.5
          ? SurveyType.trackClickOnBenefitActionEmail
          : SurveyType.trackClickOnSimulationUsefulnessEmail

      try {
        const result = await followup.sendSurvey(surveyType)
        return { ok: result._id }
      } catch (error) {
        return { ko: error }
      }
    })
  )

  console.log(results)
}

async function processSingleEmail(emailType, followupId) {
  const followup: FollowupInterface | null = await Followup.findById(followupId)
  if (!followup) {
    throw new Error("Followup not found")
  }

  let emailPromise: Promise<void>

  switch (emailType) {
    case EmailType.simulationResults:
      emailPromise = followup.sendSimulationResultsEmail()
      break
    case EmailType.benefitAction:
      emailPromise = followup.sendSurvey(
        SurveyType.trackClickOnBenefitActionEmail
      )
      break
    case EmailType.simulationUsefulness:
      emailPromise = followup.sendSurvey(
        SurveyType.trackClickOnSimulationUsefulnessEmail
      )
      break
    default:
      throw new Error(`Unknown email type: ${emailType}`)
  }

  const email = await emailPromise
  console.log("Email sent", email)
}

export async function processSendEmails(emailType, followupId, multiple) {
  if (followupId) {
    await processSingleEmail(emailType, followupId)
  } else if (multiple) {
    await sendMultipleEmails(emailType, multiple)
  } else {
    throw new Error("Missing followup id or multiple")
  }
}
