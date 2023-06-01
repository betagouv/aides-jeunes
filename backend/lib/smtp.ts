import config from "../config/index.js"
import nodemailer from "nodemailer"
const transporter = nodemailer.createTransport(config.smtp)

export function sendMail(email) {
  return transporter.sendMail({
    from: '"Équipe du simulateur 1jeune1solution.gouv.fr" <aides-jeunes@beta.gouv.fr>"',
    ...email,
  })
}
