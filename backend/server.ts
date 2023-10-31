import express, { ErrorRequestHandler, Application } from "express"
import path from "path"
import morgan from "morgan"

import configure from "./configure.js"

const __dirname = new URL(".", import.meta.url).pathname
const app: Application = express()

configure(app)
const port = process.env.PORT
app.use(morgan("combined"))

app.use(express.static(path.join(__dirname, "../../dist")))
app.route("/*").get(function (req, res) {
  res.setHeader("Cache-Control", "no-cache")
  res.sendFile(path.join(__dirname, "../../dist/index.html"))
})

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err)
  res.status(parseInt(err.code) || 500).send(err)
  next()
}
app.use(errorMiddleware)

app.listen(port, () => {
  console.log(
    `Aides Jeunes server listening on port ${port}, in ${app.get(
      "env"
    )} mode, expecting to be deployed on ${process.env.MES_AIDES_ROOT_URL}`
  )
})

export default app
