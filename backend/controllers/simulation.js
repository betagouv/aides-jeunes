const omit = require("lodash/omit")
const filter = require("lodash/filter")
const pick = require("lodash/pick")
const assign = require("lodash/assign")
var axios = require("axios")

const { baseURL } = require("../config")
const { generateSituation } = require("../../lib/situations")
const openfisca = require("../lib/openfisca")
const openfiscaTest = require("../lib/openfisca/test")
const migrations = require("../lib/migrations")
const Simulation = require("mongoose").model("Simulation")

function getSimulationOnRequest(req, simulation) {
  req.simulation = migrations.apply(simulation)
  req.situation = generateSituation(req.simulation)
}

exports.simulation = function (req, res, next, simulationId) {
  if (simulationId?._id) {
    getSimulationOnRequest(req, simulationId)
    return next()
  }

  Simulation.findById(simulationId, (err, simulation) => {
    if (!simulation) return res.sendStatus(404)
    if (err) return next(err)
    getSimulationOnRequest(req, simulation)
    next()
  })
}

exports.attachAccessCookie = function (req, res) {
  const cookiesParameters = {
    maxAge: 7 * 24 * 3600 * 1000,
    sameSite: baseURL.startsWith("https") ? "none" : "lax",
    secure: baseURL.startsWith("https"),
  }
  res.cookie(req.simulation.cookieName, req.simulation.token, cookiesParameters)
  res.cookie(
    "lastestSimulation",
    req.simulation._id.toString(),
    cookiesParameters
  )
}

exports.validateAccess = function (req, res, next) {
  if (req.simulation?.isAccessible(req.cookies)) return next()
  res.status(403).send({ error: "You do not have access to this situation." })
}

exports.show = function (req, res) {
  res.send(req.simulation)
}

function clearCookies(req, res) {
  const limit = 10

  const keys = Object.keys(req.cookies)
  const situationCookies = filter(keys, function (k) {
    return k.startsWith(Simulation.cookiePrefix)
  })
  situationCookies.sort()

  if (situationCookies.length - limit >= 0) {
    const cookieToClear = situationCookies.slice(
      0,
      situationCookies.length - limit
    )
    cookieToClear.forEach(function (name) {
      res.clearCookie(name, { httpOnly: true })
    })
  }
}

exports.create = function (req, res, next) {
  if (req.body._id)
    return res.status(403).send({
      error:
        "You can‘t provide _id when saving a situation. _id will be generated automatically.",
    })

  return Simulation.create(
    omit(req.body, "createdAt", "status", "token"),
    (err, persistedSimulation) => {
      if (err) return next(err)

      clearCookies(req, res)
      req.simulation = persistedSimulation
      exports.attachAccessCookie(req, res)
      res.send(persistedSimulation)
    }
  )
}

exports.openfiscaResponse = function (req, res, next) {
  return openfisca.calculate(req.situation, function (err, result) {
    if (err)
      return next(
        Object.assign(err.response?.data || err, {
          _id: req.situationId,
        })
      )

    if (
      req.simulation.thirdPartyData &&
      req.simulation.thirdPartyData.resultsUrl
    ) {
      axios
        .post(
          req.simulation.thirdPartyData.resultsUrl,
          {
            aidesRequestJsonPayload: req.simulation,
            aidesResponseJsonPayload: result,
          },
          process.env.RESULT_URL_API_KEY
            ? {
                headers: {
                  Authorization: `Bearer ${process.env.RESULT_URL_API_KEY}`,
                },
              }
            : {}
        )
        .catch((err) => {
          console.error("Failed to send simulation result", err)
        })
        .finally(() =>
          res.send(Object.assign(result, { _id: req.situationId }))
        )
    } else {
      res.send(Object.assign(result, { _id: req.situationId }))
    }
  })
}

exports.openfiscaTrace = function (req, res, next) {
  return openfisca.trace(req.situation, function (err, result) {
    if (err)
      return next(Object.assign(err.response.data, { _id: req.situationId }))

    res.send(Object.assign(result, { _id: req.situationId }))
  })
}

exports.openfiscaRequest = function (req, res) {
  res.send(openfisca.buildOpenFiscaRequest(req.situation))
}

exports.openfiscaRequestFromLegacy = function (req, res) {
  res.send(openfisca.buildOpenFiscaRequestFromLegacySituation(req.situation))
}

const DETAILS_DEFAULT_ATTRIBUTES = {
  absolute_error_margin: 10,
}

// Attributes are sorted as they should appear in the YAML test file
const DETAILS_ATTRIBUTES = [
  "name",
  "description",
  "extension",
  "absolute_error_margin",
  "relative_error_margin",
  "output",
]

exports.openfiscaTest = function (req, res) {
  const details = assign(
    {},
    DETAILS_DEFAULT_ATTRIBUTES,
    pick(req.body, DETAILS_ATTRIBUTES)
  )
  if (!details.name || !details.description || !details.output) {
    return res
      .status(403)
      .send({ error: "You must provide a name, description and output." })
  }

  const situation = req.situation.toObject
    ? req.situation.toObject()
    : req.situation
  res.type("yaml").send(openfiscaTest.generateYAMLTest(details, situation))
}
