import dayjs from "dayjs"
import { SmsCategory } from "../../../lib/enums/sms.js"
import { SurveyCategory } from "../../../lib/enums/survey.js"
import Followups from "../../models/followup.js"
import { Followup } from "../../../lib/types/followup.js"

const DaysBeforeInitialSms = 6

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
    sentAt: {
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
    case SmsCategory.BenefitAction:
      smsPromise = followup.sendSurveyBySms(
        SurveyCategory.TrackClickOnBenefitActionEmail
      )
      break
    default:
      throw new Error(`Unknown sms category: ${smsCategory}`)
  }

  const sms = await smsPromise
  console.log("Sms sent", sms)
}

export async function processSendSms(
  smsType: SmsCategory,
  followupId: string,
  multiple: number | null
) {
  if (followupId) {
    await processSingleSms(smsType, followupId)
  } else if (multiple) {
    await sendMultipleInitialSms(multiple)
  } else {
    throw new Error("Missing followup id or multiple")
  }
}
