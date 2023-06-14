const ms = require("smtp-tester")

module.exports = (on) => {
  const port = 7777
  const mailServer = ms.init(port)
  let lastEmail = {}

  mailServer.bind((addr, id, email) => {
    lastEmail[email.headers.to] = email
  })

  on("task", {
    getLastEmail(email) {
      return lastEmail[email] || null
    },
  })
}
