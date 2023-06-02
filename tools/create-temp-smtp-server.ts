import nodemailer from "nodemailer"

nodemailer.createTestAccount((err, account) => {
  const { smtp } = account

  console.log("Use these credentials to log in and see sent emails:")
  console.log(`Website: ${account.web}`)
  console.log(`user: ${account.user}`)
  console.log(`pass: ${account.pass}`)
  console.log("\nUse these envvar to send emails:")
  console.log(
    `SMTP_USER=${account.user} SMTP_PASS=${account.pass} SMTP_HOST=${smtp.host} SMTP_PORT=${smtp.port}`
  )
})
