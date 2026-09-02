import express, { ErrorRequestHandler, Application } from "express"
import path from "path"
import morgan from "morgan"

import configure from "./configure.js"

const __dirname = new URL(".", import.meta.url).pathname
const app: Application = express()

app.use(morgan("combined"))
configure(app)

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
app.use([errorMiddleware, morgan("combined", { stream: process.stderr })])

// `configure` renseigne les deux, défauts compris. On échoue plutôt que de
// laisser Node choisir : un port absent devient un port éphémère et un hôte
// absent lie toutes les interfaces — deux pannes silencieuses, dont une fuite.
// La borne basse compte autant que le typage : `Number("")` vaut 0, que
// `listen` traduit justement par « choisis un port au hasard ».
const port = Number(process.env.PORT)
const host = process.env.HOST
if (!Number.isInteger(port) || port <= 0 || port > 65535 || !host) {
  throw new Error(
    `Invalid listening configuration: PORT=${process.env.PORT} HOST=${process.env.HOST}`,
  )
}
app.listen(port, host, () => {
  console.log(
    `Aides Jeunes server listening on ${host}:${port}, in ${app.get(
      "env",
    )} mode, expecting to be deployed on ${process.env.MES_AIDES_ROOT_URL}`,
  )
})

export default app
