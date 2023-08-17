const ms = require("smtp-tester")

module.exports = (on) => {
  console.log("Starting SMTP server", on)
  const port = 7777
  const mailServer = ms.init(port)
  let lastEmail = {}

  mailServer.bind((addr, id, email) => {
    console.log(`Received email from ${email.headers.from}`)
    lastEmail[email.headers.to] = email
  })

  on("task", {
    getLastEmail(email) {
      console.log(`Getting last email ${lastEmail}`)
      return lastEmail[email] || null
    },
  })
}
