import config from "../config/index.js"
import nodemailer from "nodemailer"
import { Email } from "../../lib/types/email.js"

const transporter = nodemailer.createTransport(config.smtp)

export function sendEmailSmtp(email: Email) {
  const { tags, ...emailParameters } = email
  const tagsFormatted = tags?.map((tag) => tag.replace(/-/g, "_")) || []

  return transporter.sendMail({
    from: '"Équipe du simulateur 1jeune1solution.gouv.fr" <aides-jeunes@beta.gouv.fr>"',
    headers: {
      "X-TM-TAGS": JSON.stringify(tagsFormatted),
    },
    ...emailParameters,
  })
}
