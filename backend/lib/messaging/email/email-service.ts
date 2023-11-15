import { sendMail } from "../../smtp.js"
import emailRender from "../../mes-aides/emails/email-render.js"
import { EmailType } from "../../../../lib/enums/messaging.js"

export async function renderAndSendEmail(category: EmailType, followup) {
  try {
    const render: any = await emailRender(category, followup)
    const response = await sendMail({
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
