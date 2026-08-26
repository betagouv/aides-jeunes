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

// Un `code` d'erreur n'est un statut HTTP que s'il en a la forme : celui d'une
// réponse OpenFisca ou d'un pilote Mongo pilote sinon la réponse, jusqu'à faire
// lever `res.status()` sur une valeur hors plage.
function httpStatusOf(err): number {
  const code = Number(err?.code)
  return Number.isInteger(code) && code >= 400 && code <= 599 ? code : 500
}

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err)
  // Une erreur peut être une chaîne — page 502 d'un intermédiaire. L'étaler
  // comme un objet la déploierait en un dictionnaire indexé caractère par
  // caractère.
  const details =
    err && typeof err === "object" ? omit(err, UNSAFE_ERROR_KEYS) : {}
  res.status(httpStatusOf(err)).send({
    ...details,
    name: err?.name,
    message:
      err?.message ||
      (typeof err === "string" ? err : "Une erreur est survenue."),
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
