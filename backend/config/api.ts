import express from "express"
// import path from "path"
// import fs from "fs"
// import {join} from "path"

import benefitsRoutes from "../routes/benefits.js"
import followupsRoutes from "../routes/followups.js"
import githubRoutes from "../routes/github.js"
import openfiscaRoutes from "../routes/openfisca.js"
import outilsRoutes from "../routes/outils.js"
import questionsRoutes from "../routes/questions.js"
import simulationRoutes from "../routes/simulation.js"
import supportRoutes from "../routes/support.js"
import teleservicesRoutes from "../routes/teleservices.js"

const api = express()

api.use(express.json())

benefitsRoutes(api)
followupsRoutes(api)
githubRoutes(api)
openfiscaRoutes(api)
outilsRoutes(api)
questionsRoutes(api)
simulationRoutes(api)
supportRoutes(api)
teleservicesRoutes(api)

// const routesPath = path.join(path.dirname(""), "dist-server/backend/routes")
// fs.readdirSync(routesPath).forEach(async (file) => {
//   if (/(.*)\.(js$|coffee$)/.test(file)) {
//     const routes = await import(`../../../${routesPath}/${file}`)
//     routes.default(api)
//   }
// })

api.all("*", function (req, res) {
  res.sendStatus(404)
})

export default api
