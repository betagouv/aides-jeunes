import dayjs from "dayjs"

import { EmailType } from "../../../lib/enums/messaging.js"
import { SurveyType } from "../../../lib/enums/survey.js"
import Followups from "../../models/followup.js"
import { Followup } from "../../../lib/types/followup.js"
import {
  sendSimulationResultsEmail,
  sendSurveyEmail,
} from "../messaging/email/email-service.js"

const DaysBeforeInitialEmail = 6

async function sendMultipleEmails(emailType: EmailType, limit: number) {
  switch (emailType) {
    case EmailType.InitialSurvey:
      await sendMultipleInitialEmails(limit)
      break
    default:
      throw new Error(`Unknown email type ${emailType} for multiple emails`)
  }
}

async function sendMultipleInitialEmails(limit: number) {
  const followups: any[] = await Followups.find({
    surveys: {
      $not: {
        $elemMatch: {
          type: {
            $in: [
              SurveyType.BenefitAction,
              SurveyType.TrackClickOnSimulationUsefulnessEmail,
              SurveyType.TrackClickOnBenefitActionEmail,
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

  const results: { ok?: any; ko?: any }[] = await Promise.all(
    followups.map(async (followup: Followup) => {
      try {
        const survey = await sendSurveyEmail(
          followup,
          SurveyType.TrackClickOnSimulationUsefulnessEmail
        )
        return { survey_id: survey._id }
      } catch (error) {
        return { ko: error }
      }
    })
  )

  console.log(results)
}

async function processSingleEmail(emailType: EmailType, followupId: string) {
  const followup: Followup | null = await Followups.findById(followupId)
  if (!followup) {
    throw new Error("Followup not found")
  }

  switch (emailType) {
    case EmailType.SimulationResults:
      await sendSimulationResultsEmail(followup)
      break
    case EmailType.SimulationUsefulness:
      await sendSurveyEmail(
        followup,
        SurveyType.TrackClickOnSimulationUsefulnessEmail
      )
      break
    default:
      throw new Error(`Unknown email type: ${emailType}`)
  }
}

export async function processSendEmails(
  emailType: EmailType,
  followupId: string,
  multiple: number | null
) {
  if (followupId) {
    await processSingleEmail(emailType, followupId)
  } else if (multiple) {
    await sendMultipleEmails(emailType, multiple)
  } else {
    throw new Error("Missing followup id or multiple")
  }
}
