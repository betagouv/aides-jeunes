import express from "express"
import { followup } from "../controllers/followups.js"
import simulationController from "../controllers/simulation.js"

const route = express()

route.param("followupId", followup)
route.get(
  "/:followupId",
  simulationController.attachAccessCookie,
  simulationController.redirectToResults
)
route.get(
  "/recap/:followupId",
  simulationController.attachAccessCookie,
  simulationController.redirectToRecap
)

export default route
