import cookieParser from "cookie-parser"
import express, { Express } from "express"

import moncompteproController from "../controllers/moncomptepro.js"
import simulationController from "../controllers/simulation.js"

export default function (api: Express) {
  const route = express.Router({ mergeParams: true })
  route.use(cookieParser())
  route.use(moncompteproController.access)

  route.get(
    "/simulation/:simulationId",
    (req, res, next) => {
      const simulationId = Array.isArray(req.params.simulationId)
        ? req.params.simulationId[0]
        : req.params.simulationId
      simulationController.simulation(req, res, next, simulationId)
    },
    simulationController.attachAccessCookie,
    simulationController.redirect,
  )

  api.use("/support", route)
}
