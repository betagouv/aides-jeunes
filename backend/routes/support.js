const cookieParser = require("cookie-parser")
const githubController = require("../controllers/github")
const supportController = require("../controllers/support")
const simulationController = require("../controllers/simulation")
const express = require("express")

module.exports = function (api) {
  const route = new express.Router({ mergeParams: true })
  route.use(cookieParser())
  route.use(githubController.access)

  route.get(
    "/simulation/:simulationId",
    (req, res, next) => {
      simulationController.simulation(req, res, next, req.params.simulationId)
    },
    supportController.simulation
  )

  api.use("/support", route)
}
