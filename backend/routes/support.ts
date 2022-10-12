import cookieParser from "cookie-parser"
import express from "express"

import githubController from "../controllers/github"
import supportController from "../controllers/support"
import simulationController from "../controllers/simulation"

export default function (api) {
  const route = express.Router({ mergeParams: true })
  route.use(cookieParser())
  route.use(githubController.access)

  route.get(
    "/simulation/:simulationId",
    (req, res, next) => {
      simulationController.simulation(req, res, next, req.params.simulationId)
    },
    supportController
  )

  api.use("/support", route)
}
