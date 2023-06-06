import nodemailer from "nodemailer"

nodemailer.createTestAccount((err, account) => {
  const { smtp } = account

  console.log(`Use these credentials to log in and see sent emails:
Website: ${account.web}
user: ${account.user}
pass: ${account.pass}

Use these envvar to send emails:
SMTP_USER=${account.user} SMTP_PASS=${account.pass} SMTP_HOST=${smtp.host} SMTP_PORT=${smtp.port}
`)
})
