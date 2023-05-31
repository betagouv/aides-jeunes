import nodemailer from "nodemailer"

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // create reusable transporter object using the default SMTP transport
  // the settings could come from .env file or environment variables
  const transporter = nodemailer.createTransport({
    host: "localhost",
    port: 7777,
    secure: false, // true for 465, false for other ports
  })

  // send an email
  const info = await transporter.sendMail({
    from: '"Fred Blogger" <freg@blogger.com>',
    to: "gleb@startup.io", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  })

  console.log("Message sent: %s", info.messageId)
}

main().catch(console.error)
