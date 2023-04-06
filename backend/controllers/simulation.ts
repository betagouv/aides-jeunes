import { omit, filter, pick, assign } from "lodash-es"

import config from "../config/index.js"
import { generateSituation } from "../../lib/situations.js"
import openfisca from "../lib/openfisca/index.js"
import openfiscaTestLib from "../lib/openfisca/test.js"
import { apply } from "../lib/migrations/index.js"

import Simulation from "../models/simulation.js"

function setSimulationOnRequest(req, simulation) {
  req.simulation = apply(simulation)
  req.situation = generateSituation(req.simulation)
}

function simulation(req, res, next, simulationOrSimulationId) {
  if (simulationOrSimulationId?._id) {
    const simulation = simulationOrSimulationId
    setSimulationOnRequest(req, simulation)
    return next()
  }

  const simulationId = simulationOrSimulationId
  Simulation.findById(simulationId, (err, simulation) => {
    if (!simulation) return res.sendStatus(404)
    if (err) return next(err)
    setSimulationOnRequest(req, simulation)
    next()
  })
}

function attachAccessCookie(req, res, next?) {
  const cookiesParameters = {
    maxAge: 7 * 24 * 3600 * 1000,
    sameSite: config.baseURL.startsWith("https") ? "none" : "lax",
    secure: config.baseURL.startsWith("https"),
  }
  res.cookie(req.simulation.cookieName, req.simulation.token, cookiesParameters)
  res.cookie(
    "lastestSimulation",
    req.simulation._id.toString(),
    cookiesParameters
  )
  next && next()
}

function validateAccess(req, res, next) {
  if (
    req.simulation?.isAccessible({
      ...req.cookies,
      ...req.query,
      ...req.headers,
    })
  )
    return next()
  res.status(403).send({ error: "You do not have access to this situation." })
}

function show(req, res) {
  res.send(req.simulation)
}

function clearCookies(req, res) {
  const limit = 10

  const keys = Object.keys(req.cookies)
  const situationCookies = filter(keys, function (k) {
    return k.startsWith(Simulation.cookiePrefix())
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

function create(req, res, next) {
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
      next && next()
    }
  )
}

function openfiscaResponse(req, res, next) {
  return openfisca.calculate(req.situation, function (err, result) {
    if (err)
      return next(
        Object.assign(err.response?.data || err, {
          _id: req.simulationId,
        })
      )

    res.send(Object.assign(result, { _id: req.simulationId }))
  })
}

function results(req, res, next) {
  return req.simulation
    .compute()
    .then((results) => {
      return res.send(Object.assign(results, { _id: req.simulation._id }))
    })
    .catch((err) => {
      return next(
        Object.assign(err?.response?.data || err, {
          _id: req.simulation._id,
        })
      )
    })
}

function openfiscaTrace(req, res, next) {
  return openfisca.trace(req.situation, function (err, result) {
    if (err)
      return next(Object.assign(err.response.data, { _id: req.simulationId }))

    res.send(Object.assign(result, { _id: req.simulationId }))
  })
}

function openfiscaRequest(req, res) {
  res.send(openfisca.buildOpenFiscaRequest(req.situation))
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

function openfiscaTest(req, res) {
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
  res.type("yaml").send(openfiscaTestLib.generateYAMLTest(details, situation))
}

function redirect(req, res) {
  res.redirect(
    `/simulation/redirect${req?.query?.to ? `?to=${req.query.to}` : ""}`
  )
}

export default {
  simulation,
  attachAccessCookie,
  validateAccess,
  show,
  create,
  openfiscaResponse,
  openfiscaTrace,
  openfiscaRequest,
  openfiscaTest,
  redirect,
  results,
}
