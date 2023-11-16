import { sendEmailSmtp } from "../../smtp.js"
import emailRender from "../../mes-aides/emails/email-render.js"
import { EmailType } from "../../../../lib/enums/messaging.js"

export async function sendEmail(category: EmailType, followup) {
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
