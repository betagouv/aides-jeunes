var express = require("express")
var cookieParser = require("cookie-parser")
var cors = require("cors")

var followups = require("../controllers/followups")
var answers = require("../controllers/answers")
var teleservices = require("../controllers/teleservices")

module.exports = function (api) {
  api.route("/answers").post(cookieParser(), answers.create)

  var route = new express.Router({ mergeParams: true })
  route.use(cookieParser())
  route.use(answers.validateAccess)

  route.get("/", answers.show)
  route.get("/openfisca-response", answers.openfiscaResponse)
  route.get("/legacy-openfisca-request", answers.openfiscaRequestFromLegacy)

  // Enable CORS for openfisca-tracer
  route.options("/openfisca-request", cors())
  route.get(
    "/openfisca-request",
    cors({ origin: "*" }),
    answers.openfiscaRequest
  )

  route.post("/openfisca-test", answers.openfiscaTest)
  route.get("/openfisca-trace", answers.openfiscaTrace)

  route.post("/followup", followups.persist)

  teleservices.names.forEach(function (name) {
    route.get(
      "/" + name,
      teleservices.metadataResponseGenerator(teleservices[name])
    )
  })

  api.options("/answers/via/:signedPayload", cors())
  api.get(
    "/answers/via/:signedPayload",
    cors({ origin: "*" }),
    teleservices.checkCredentials,
    teleservices.attachPayloadSituation,
    teleservices.verifyRequest,
    teleservices.exportRepresentation
  )
  api.use("/answers/:situationId", route)

  /*
   ** Param injection
   */
  api.param("situationId", answers.answers)
  api.param("signedPayload", teleservices.decodePayload)
}
