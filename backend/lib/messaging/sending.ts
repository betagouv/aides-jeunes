import dayjs from "dayjs"
import { EmailCategory, SmsCategory } from "../../../lib/enums/messaging.js"
import { SurveyCategory } from "../../../lib/enums/survey.js"
import Followups from "../../models/followup.js"
import { Followup } from "../../../lib/types/followup.js"

const DaysBeforeInitialSms = 6
const DaysBeforeInitialEmail = 6
const DaysBeforeTousABordNotificationEmail = 2

async function sendMultipleEmails(emailType: EmailCategory, limit: number) {
  switch (emailType) {
    case EmailCategory.InitialSurvey:
      await sendMultipleInitialEmails(limit)
      break
    case EmailCategory.TousABordNotification:
      await sendMultipleTousABordNotificationEmails(limit)
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
              SurveyCategory.BenefitAction,
              SurveyCategory.TrackClickOnSimulationUsefulnessEmail,
              SurveyCategory.TrackClickOnBenefitActionEmail,
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
      const surveyType =
        Math.random() > 0.5
          ? SurveyCategory.TrackClickOnBenefitActionEmail
          : SurveyCategory.TrackClickOnSimulationUsefulnessEmail

      try {
        const result = await followup.sendSurveyByEmail(surveyType)
        return { ok: result._id }
      } catch (error) {
        return { ko: error }
      }
    })
  )

  console.log(results)
}

async function sendMultipleTousABordNotificationEmails(limit: number) {
  const followups = await Followups.find({
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
          type: SurveyCategory.TousABordNotification,
        },
      },
    },
  })
    .sort({ createdAt: 1 })
    .limit(limit)

  const results = await Promise.all(
    followups.map(async (followup: Followup) => {
      try {
        const result = await followup.sendSurveyByEmail(
          SurveyCategory.TousABordNotification
        )
        return { ok: result._id }
      } catch (error) {
        return { ko: error }
      }
    })
  )
  console.log(results)
}

async function processSingleEmail(
  emailType: EmailCategory,
  followupId: string
) {
  const followup: Followup | null = await Followups.findById(followupId)
  if (!followup) {
    throw new Error("Followup not found")
  }

  let emailPromise: Promise<void>

  switch (emailType) {
    case EmailCategory.SimulationResults:
      emailPromise = followup.sendSimulationResultsEmail()
      break
    case EmailCategory.BenefitAction:
      emailPromise = followup.sendSurveyByEmail(
        SurveyCategory.TrackClickOnBenefitActionEmail
      )
      break
    case EmailCategory.SimulationUsefulness:
      emailPromise = followup.sendSurveyByEmail(
        SurveyCategory.TrackClickOnSimulationUsefulnessEmail
      )
      break
    default:
      throw new Error(`Unknown email type: ${emailType}`)
  }

  const email = await emailPromise
  console.log("Email sent", email)
}

export async function processSendEmails(
  emailType: EmailCategory,
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

async function sendMultipleInitialSms(limit: number) {
  const followups: any[] = await Followups.find({
    surveys: {
      $not: {
        $elemMatch: {
          type: {
            $in: [
              SurveyCategory.BenefitAction,
              SurveyCategory.TrackClickOnBenefitActionSms,
            ],
          },
        },
      },
    },
    smsSentAt: {
      $lt: dayjs().subtract(DaysBeforeInitialSms, "day").toDate(),
    },
    surveyOptin: true,
  })
    .sort({ createdAt: 1 })
    .limit(limit)

  const results: { ok?: any; ko?: any }[] = await Promise.all(
    followups.map(async (followup: Followup) => {
      try {
        const result = await followup.sendSurveyBySms(
          SurveyCategory.TrackClickOnBenefitActionSms
        )
        return { "Sms sent": result._id }
      } catch (error) {
        return { ko: error }
      }
    })
  )

  console.log(results)
}

async function processSingleSms(smsCategory: SmsCategory, followupId: string) {
  const followup: Followup | null = await Followups.findById(followupId)
  if (!followup) {
    throw new Error("Followup not found")
  }

  let smsPromise: Promise<void>

  switch (smsCategory) {
    case SmsCategory.SimulationResults:
      smsPromise = followup.sendSimulationResultsSms()
      break
    case SmsCategory.InitialSurvey:
      smsPromise = followup.sendSurveyBySms(
        SurveyCategory.TrackClickOnBenefitActionSms
      )
      break
    default:
      throw new Error(`Unknown sms category: ${smsCategory}`)
  }

  const sms = await smsPromise
  console.log("Sms sent", sms)
}

export async function processSendSms(
  smsCategory: SmsCategory,
  followupId: string,
  multiple: number | null
) {
  if (followupId) {
    await processSingleSms(smsCategory, followupId)
  } else if (multiple) {
    await sendMultipleInitialSms(multiple)
  } else {
    throw new Error("Missing followup id or multiple")
  }
}
