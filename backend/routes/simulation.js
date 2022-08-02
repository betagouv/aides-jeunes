const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const followups = require("../controllers/followups")
const simulationController = require("../controllers/simulation")
const teleservices = require("../controllers/teleservices")

module.exports = function (api) {
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

  const route = new express.Router({ mergeParams: true })
  route.use(cookieParser())

  route.use(simulationController.validateAccess)

  route.get("/", simulationController.show)
  route.get("/openfisca-response", simulationController.openfiscaResponse)
  route.get(
    "/legacy-openfisca-request",
    simulationController.openfiscaRequestFromLegacy
  )
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

  route.post("/followup", followups.persist)

  teleservices.names.forEach(function (name) {
    route.get(
      `/${name}`,
      cors({ origin: "*" }),
      teleservices.metadataResponseGenerator(teleservices[name])
    )
  })

  api.options("/simulation/via/:signedPayload", cors())
  api.get(
    "/simulation/via/:signedPayload",
    cors({ origin: "*" }),
    teleservices.checkCredentials,
    teleservices.attachPayloadSituation,
    teleservices.verifyRequest,
    teleservices.exportRepresentation
  )
  api.use("/simulation/:situationId", route)

  /*
   ** Param injection
   */
  api.param("situationId", simulationController.simulation)
  api.param("signedPayload", teleservices.decodePayload)
}
