import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

import { persist } from "../controllers/followups.js"
import simulationController from "../controllers/simulation.js"
import teleservices from "../controllers/teleservices/index.js"

export default function (api) {
  api.options("/simulation", cors())
  api
    .route("/simulation")
    .post(
      cors({ origin: "*" }),
      cookieParser(),
      simulationController.create,
      simulationController.attachAccessCookie,
      simulationController.show
    )

  api.options("/simulation/via/:signedPayload", cors())
  api.get(
    "/simulation/via/:signedPayload",
    cors({ origin: "*" }),
    teleservices.checkCredentials,
    teleservices.attachPayloadSituation,
    teleservices.verifyRequest,
    teleservices.exportRepresentation
  )
  api.param("signedPayload", teleservices.decodePayload)

  const route = express.Router({ mergeParams: true })
  route.use(cookieParser())

  route.use(simulationController.validateAccess)

  route.get("/", simulationController.show)
  route.get("/openfisca-response", simulationController.openfiscaResponse)
  route.get("/results", simulationController.results)
  route.get("/followup", simulationController.getLatestFollowup)

  route.get(
    "/redirect",
    simulationController.attachAccessCookie,
    simulationController.redirect
  )

  // Enable CORS for openfisca-tracer
  route.options("/openfisca-request", cors())
  route.get(
    "/openfisca-request",
    cors({ origin: "*" }),
    simulationController.openfiscaRequest
  )

  route.post("/openfisca-test", simulationController.openfiscaTest)
  route.get("/openfisca-trace", simulationController.openfiscaTrace)

  route.post("/followup", persist)

  teleservices.names.forEach(function (name) {
    route.get(
      `/${name}`,
      cors({ origin: "*" }),
      teleservices.metadataResponseGenerator(teleservices[name])
    )
  })

  route.param("simulationId", simulationController.simulation)
  api.use("/simulation/:simulationId", route)
}
