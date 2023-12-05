import dayjs from "dayjs"

import { EmailType, SmsType } from "../../../lib/enums/messaging.js"
import { SurveyType } from "../../../lib/enums/survey.js"
import Followups from "../../models/followup.js"
import { Followup } from "../../../lib/types/followup.js"
import {
  sendSimulationResultsEmail,
  sendSurveyEmail,
} from "../messaging/email/email-service.js"
import {
  sendSimulationResultsSms,
  sendSurveyBySms,
} from "../messaging/sms/sms-service.js"
import { Survey } from "../../../lib/types/survey.js"

const DaysBeforeInitialSurvey = 6
const DelayAfterInitialSurveyEmail = 3

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
      $lt: dayjs().subtract(DaysBeforeInitialSurvey, "day").toDate(),
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

function getEmailSurvey(followup: Followup): Survey | undefined {
  return followup.surveys.find((survey) =>
    [
      SurveyType.TrackClickOnBenefitActionEmail,
      SurveyType.TrackClickOnSimulationUsefulnessEmail,
    ].includes(survey.type)
  )
}

export function shouldSendSurveyBySms(followup: Followup): boolean {
  const hasPhone = !!followup.phone
  const hasEmail = !!followup.email
  const emailSurvey = getEmailSurvey(followup)

  if (hasPhone && !hasEmail) {
    return true
  }

  if (hasPhone && hasEmail && emailSurvey && emailSurvey.answers.length === 0) {
    const surveyEmailCreatedAtWithDelay = dayjs(emailSurvey.createdAt).add(
      DelayAfterInitialSurveyEmail,
      "day"
    )
    return dayjs().isAfter(surveyEmailCreatedAtWithDelay)
  }

  return false
}

function initialSurveySmsMongooseCriteria(): any {
  const getDaysBeforeInitialSurveyDate = (): Date =>
    dayjs().subtract(DaysBeforeInitialSurvey, "day").toDate()
  return {
    phone: {
      $exists: true,
    },
    surveys: {
      $not: {
        $elemMatch: {
          type: {
            $in: [
              SurveyType.BenefitAction, // TODO:
              // - remove this line 10 days after this comment added in production
              //  - add a condition on createdAt : { $gt: "this comment added in production date" }
              SurveyType.TrackClickOnBenefitActionSms,
            ],
          },
        },
      },
    },
    smsSentAt: {
      $lt: getDaysBeforeInitialSurveyDate(),
    },
    surveyOptin: true,
  }
}

export async function filterInitialSurveySms(
  followups: any[],
  limit: number
): Promise<Followup[]> {
  return followups
    .slice(0, limit)
    .filter((followup) => shouldSendSurveyBySms(followup))
}

export async function sendMultipleInitialSms(limit: number) {
  const mongooseFollowups = await Followups.find(
    initialSurveySmsMongooseCriteria()
  ).sort({ createdAt: 1 })
  const followupsToSendSms: any[] = await filterInitialSurveySms(
    mongooseFollowups,
    limit
  )

  const results = await Promise.all(
    followupsToSendSms.map(async (followup: Followup) => {
      try {
        const survey = await sendSurveyBySms(followup)
        return { "Survey sent": survey._id }
      } catch (error) {
        return { ko: error }
      }
    })
  )
  console.log(results)
}

async function processSingleSms(smsType: SmsType, followupId: string) {
  const followup: Followup | null = await Followups.findById(followupId)
  if (!followup) {
    throw new Error("Followup not found")
  }
  switch (smsType) {
    case SmsType.SimulationResults:
      await sendSimulationResultsSms(followup)
      break
    case SmsType.InitialSurvey:
      await sendSurveyBySms(followup)
      break
    default:
      throw new Error(`Unknown sms category: ${SmsType}`)
  }
}

export async function processSendSms(
  SmsType: SmsType,
  followupId: string,
  multiple: number | null
) {
  if (followupId) {
    await processSingleSms(SmsType, followupId)
  } else if (multiple) {
    await sendMultipleInitialSms(multiple)
  } else {
    throw new Error("Missing followup id or multiple")
  }
}
