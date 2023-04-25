import { EmailType } from "../../enums/email.js"
import { SurveyType } from "../../../lib/enums/survey.js"
import Followup, { FollowupInterface } from "../../models/followup.js"

const oneDay = 24 * 60 * 60 * 1000
const DelayBeforeInitialEmail = 6.5 * oneDay
async function sendMultipleEmails(emailType, limit) {
  switch (emailType) {
    case EmailType.initialSurvey:
      await sendMultipleInitialEmails(limit)
      break
    default:
      throw new Error("Unknown email type for multiple emails")
  }
}

async function sendMultipleInitialEmails(limit) {
  const followups = await Followup.find({
    surveys: { $size: 0 },
    sentAt: {
      $lt: new Date(new Date().getTime() - DelayBeforeInitialEmail),
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
