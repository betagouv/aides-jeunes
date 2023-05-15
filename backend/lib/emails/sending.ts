import dayjs from "dayjs"

import { EmailType } from "../../enums/email.js"
import { SurveyType } from "../../../lib/enums/survey.js"
import Followup, { FollowupInterface } from "../../models/followup.js"

const DaysBeforeInitialEmail = 6
const DaysBeforeTousABordNotificationEmail = 2

async function sendMultipleEmails(emailType, limit) {
  switch (emailType) {
    case EmailType.initialSurvey:
      await sendMultipleInitialEmails(limit)
      break
    case EmailType.tousABordNotification:
      await sendMultipleTousABordNotificationEmails(limit)
      break
    default:
      throw new Error("Unknown email type for multiple emails")
  }
}

async function sendMultipleInitialEmails(limit) {
  const followups = await Followup.find({
    surveys: {
      $not: {
        $elemMatch: {
          type: {
            $in: [
              SurveyType.benefitAction,
              SurveyType.trackClickOnSimulationUsefulnessEmail,
              SurveyType.trackClickOnBenefitActionEmail,
            ],
          },
        },
      },
    },
    sentAt: {
      $lt: dayjs().subtract(DaysBeforeInitialEmail, "day").toDate(),
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

async function sendMultipleTousABordNotificationEmails(limit) {
  const followups = await Followup.find({
    benefits: {
      $elemMatch: {
        id: "pass-pass-pour-les-demandeurs-demploi",
      },
    },
    sentAt: {
      $lt: dayjs()
        .subtract(DaysBeforeTousABordNotificationEmail, "day")
        .toDate(),
    },
    email: { $exists: true },
    surveyOptin: true,
    surveys: {
      $not: {
        $elemMatch: {
          type: SurveyType.tousABordNotification,
        },
      },
    },
  })
    .sort({ createdAt: 1 })
    .limit(limit)

  const results = await Promise.all(
    followups.map(async (followup) => {
      try {
        const result = await followup.sendSurvey(
          SurveyType.tousABordNotification
        )
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
