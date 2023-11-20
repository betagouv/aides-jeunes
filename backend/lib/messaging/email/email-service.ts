import { sendEmailSmtp } from "../../smtp.js"
import {
  emailRender,
  emailRenderBySurveyType,
} from "../../mes-aides/emails/email-render.js"
import { EmailType } from "../../../../lib/enums/messaging.js"
import { SurveyType } from "@lib/enums/survey.js"
import { Survey } from "@lib/types/survey.js"
import { Followup } from "@lib/types/followup.js"
import dayjs from "dayjs"

export async function sendSimulationResultsEmail(
  followup: Followup
): Promise<Followup> {
  if (!followup.email) {
    throw new Error("Missing followup email")
  }
  const render: any = await emailRender(EmailType.SimulationResults, followup)
  const sendEmailSmtpResponse = await sendEmailSmtp({
    to: followup.email,
    subject: render.subject,
    text: render.text,
    html: render.html,
    tags: [EmailType.SimulationResults],
  })

  followup.sentAt = dayjs().toDate()
  followup.messageId = sendEmailSmtpResponse.messageId

  if (!followup.surveyOptin) {
    followup.email = undefined
  }
  followup.error = undefined

  return await followup.save()
}

export async function sendSurveyEmail(
  followup: Followup,
  surveyType: SurveyType,
  survey: Survey
): Promise<Followup> {
  if (!followup.email) {
    throw new Error("Missing followup email")
  }
  const render: any = await emailRenderBySurveyType(surveyType, followup)
  const sendEmailSmtpResponse = await sendEmailSmtp({
    to: followup.email,
    subject: render.subject,
    text: render.text,
    html: render.html,
    tags: ["survey", surveyType],
  })

  survey.messageId = sendEmailSmtpResponse.messageId

  return await followup.save()
}

export async function sendEmail(
  emailType: EmailType,
  followup,
  surveyType?: SurveyType,
  survey?: Survey
) {
  try {
    switch (emailType) {
      case EmailType.SimulationResults:
        return await sendSimulationResultsEmail(followup)
      case EmailType.BenefitAction:
      case EmailType.SimulationUsefulness:
        if (surveyType && survey) {
          return sendSurveyEmail(followup, surveyType, survey)
        }
        break
      case EmailType.TousABordNotification:
        // Todo: send tousabord email
        break
      default:
        throw new Error(`Unknown email type ${emailType}`)
    }
  } catch (err) {
    console.error("error", err)
    throw err
  }
}
