import {
  followupByAccessToken,
  smsSurveyLinkClick,
} from "../controllers/followups.js"
import simulation from "../controllers/support.js"
import simulationController from "../controllers/simulation.js"
import { Express } from "express"

export default function (api: Express) {
  api.route("/sms/:accessToken").get((req, res, next) => {
    const simulationId = req.followup?.simulation._id.toString()
    simulationController.simulation(req, res, next, simulationId)
  }, simulation)
  api.route("/r/:accessToken").get(smsSurveyLinkClick) // r = redirection (sms needs short message length)
  api.param("accessToken", followupByAccessToken)
}
