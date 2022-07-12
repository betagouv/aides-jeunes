import cookieParser from "cookie-parser"
import express from "express"

const githubController = require("../controllers/github")
const supportController = require("../controllers/support")
const simulationController = require("../controllers/simulation")

module.exports = function (api) {
  const route = new express.Router({ mergeParams: true })
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
