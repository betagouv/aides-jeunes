import { sendMail } from "../backend/lib/smtp.js"

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // send an email
  const info = await sendMail({
    from: '"Fred Blogger" <freg@blogger.com>',
    to: "thomas.guillet@beta.gouv.fr", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body,
    headers: {
      "x-tm-tags": '["welcome4", "website4"]',
    },
  })

  console.log("Message sent: %s", info.messageId)
}

main().catch(console.error)
