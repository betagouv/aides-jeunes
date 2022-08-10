/* eslint-disable no-console */

import express from "express"
import path from "path"
import configure from "./configure.js"
const __dirname = new URL(".", import.meta.url).pathname

const app = express()

const port = process.env.PORT || 8080

process.env.MES_AIDES_ROOT_URL =
  process.env.MES_AIDES_ROOT_URL || `http://localhost:${port}`

configure({ app })

app.use(express.static("../dist"))
app.route("/*").get(function (req, res) {
  res.sendFile(path.join(__dirname, "../dist/index.html"))
})

app.use(function (err, req, res, next) {
  console.error(err)
  res.status(parseInt(err.code) || 500).send(err)
  next()
})

app.listen(port, () => {
  console.log(
    `Aides Jeunes server listening on port ${port}, in ${app.get(
      "env"
    )} mode, expecting to be deployed on ${process.env.MES_AIDES_ROOT_URL}`
  )
})

export default app
