import ms from "smtp-tester"
const port = 7777
const mailServer = ms.init(port)
console.log("mail server at port %d", port)

// process all emails
mailServer.bind((addr, id, email) => {
  console.log("--- email ---")
  console.log(addr, id, email)
})
