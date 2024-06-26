import { sendEmailSmtp } from "../../smtp.js"
import {
  emailRender,
  emailRenderBySurveyType,
} from "../../mes-aides/emails/email-render.js"
import { EmailType } from "../../../../lib/enums/messaging.js"
import { SurveyType } from "../../../../lib/enums/survey.js"
import { Survey } from "../../../../lib/types/survey.js"
import { Followup } from "../../../../lib/types/followup.js"
import dayjs from "dayjs"

export async function sendSimulationResultsEmail(
  followup: Followup,
  emailType: EmailType = EmailType.SimulationResults
): Promise<Followup> {
  if (!followup.email) {
    throw new Error("Missing followup email")
  }
  const render: any = await emailRender(emailType, followup)
  const sendEmailSmtpResponse = await sendEmailSmtp({
    to: followup.email,
    subject: render.subject,
    text: render.text,
    html: render.html,
    tags: [emailType],
  })

  followup.sentAt = dayjs().toDate()
  followup.messageId = sendEmailSmtpResponse.messageId

  if (!followup.surveyOptin) {
    followup.email = undefined
  }
  followup.error = undefined

  return await followup.save()
}

export async function sendSimulationResultsSupportEmail(followup: Followup) {
  return sendSimulationResultsEmail(
    followup,
    EmailType.SimulationResultsSupport
  )
}

export async function sendSurveyEmail(
  followup: Followup,
  surveyType: SurveyType
): Promise<Survey> {
  if (!followup.email) {
    throw new Error("Missing followup email")
  }
  const survey = await followup.addSurveyIfMissing(surveyType)
  const render: any = await emailRenderBySurveyType(surveyType, followup)
  const sendEmailSmtpResponse = await sendEmailSmtp({
    to: followup.email,
    subject: render.subject,
    text: render.text,
    html: render.html,
    tags: ["survey", surveyType],
  })

  survey.messageId = sendEmailSmtpResponse.messageId
  await followup.save()
  return survey
}
