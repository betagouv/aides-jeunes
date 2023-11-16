import { sendEmailSmtp } from "../../smtp.js"
import emailRender from "../../mes-aides/emails/email-render.js"
import { EmailCategory } from "../../../../lib/enums/messaging.js"

export async function sendEmail(category: EmailCategory, followup) {
  try {
    const render: any = await emailRender(category, followup)
    const response = await sendEmailSmtp({
      to: followup.email,
      subject: render.subject,
      text: render.text,
      html: render.html,
      tags: [category],
    })
    return response.messageId
  } catch (err) {
    console.error("error", err)
    throw err
  }
}
