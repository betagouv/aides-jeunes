import config from "../config/index.js"
import nodemailer from "nodemailer"
import { EmailLayout } from "../../lib/types/email.js"

const transporter = nodemailer.createTransport(config.smtp)

export function sendMail(email: EmailLayout) {
  return transporter.sendMail({
    from: '"Équipe du simulateur 1jeune1solution.gouv.fr" <aides-jeunes@beta.gouv.fr>"',
    ...email,
  })
}
