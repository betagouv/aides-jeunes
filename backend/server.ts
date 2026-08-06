import express, { ErrorRequestHandler, Application } from "express"
import path from "path"
import morgan from "morgan"
import axios from "axios"
import { omit } from "lodash-es"

import configure from "./configure.js"

const __dirname = new URL(".", import.meta.url).pathname
const app: Application = express()

// Keep legacy Axios behavior while we prepare the migration to fetch.
axios.defaults.allowAbsoluteUrls = true

app.use(morgan("combined"))
configure(app)

app.use(express.static(path.join(__dirname, "../../dist")))
app.route("/*").get(function (req, res) {
  res.setHeader("Cache-Control", "no-cache")
  res.sendFile(path.join(__dirname, "../../dist/index.html"))
})

// Les objets d'erreur des bibliothèques HTTP portent la pile d'appels et la
// configuration de la requête sortante, avec son URL interne et son contenu.
// Le reste, dont le corps renvoyé par OpenFisca, est utile au diagnostic.
const UNSAFE_ERROR_KEYS = ["stack", "config", "request", "response"]

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err)
  res.status(parseInt(err?.code) || 500).send({
    ...omit(err || {}, UNSAFE_ERROR_KEYS),
    name: err?.name,
    message: err?.message || "Une erreur est survenue.",
  })
  next()
}
app.use([errorMiddleware, morgan("combined", { stream: process.stderr })])

const port = process.env.PORT
app.listen(port, () => {
  console.log(
    `Aides Jeunes server listening on port ${port}, in ${app.get(
      "env",
    )} mode, expecting to be deployed on ${process.env.MES_AIDES_ROOT_URL}`,
  )
})

export default app
