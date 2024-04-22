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
      simulationController.simulation(req, res, next, req.params.simulationId)
    },
    simulationController.attachAccessCookie,
    simulationController.redirect
  )

  api.use("/support", route)
}
