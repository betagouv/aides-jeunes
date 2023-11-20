import { sendEmailSmtp } from "../../smtp.js"
import {
  emailRender,
  renderSurveyEmail,
} from "../../mes-aides/emails/email-render.js"
import { EmailCategory } from "../../../../lib/enums/messaging.js"
import { SurveyCategory } from "../../../../lib/enums/survey.js"

export async function sendSimulationResults(category: EmailCategory, followup) {
  try {
    const render: any = await emailRender(category, followup)
    const response = await sendEmailSmtp({
      to: followup.email,
      subject: render.subject,
      text: render.text,
      html: render.html,
      tags: [category],
    })
    followup.sentAt = Date.now()
    followup.messageId = response.messageId
    if (!followup.surveyOptin) {
      followup.email = undefined
    }
    followup.error = undefined
    return followup.save()
  } catch (err) {
    console.error("error", err)
    throw err
  }
}

export async function sendSurvey(surveyType: SurveyCategory, followup) {
  let survey

  try {
    survey = await followup.addSurveyIfMissing(surveyType)
    const render = await renderSurveyEmail(surveyType, followup)
    const response = await sendEmailSmtp({
      to: followup.email,
      subject: render.subject,
      text: render.text,
      html: render.html,
      tags: ["survey", surveyType],
    })

    survey.messageId = response.messageId
  } catch (err) {
    console.error("error", err)
    survey.error = err
    throw err
  } finally {
    await followup.save()
  }

  return survey
}
