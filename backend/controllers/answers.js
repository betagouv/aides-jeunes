const omit = require("lodash/omit")
const filter = require("lodash/filter")
const pick = require("lodash/pick")
const assign = require("lodash/assign")

const { generateSituation } = require("../../lib/situations")
const openfisca = require("../lib/openfisca")
const openfiscaTest = require("../lib/openfisca/test")
const Answers = require("mongoose").model("Answer")

exports.answers = function (req, res, next, answersId) {
  if (answersId?._id) {
    req.answers = answersId
    req.situation = generateSituation(answersId)
    return next()
  }

  Answers.findById(answersId, (err, answers) => {
    if (err) return next(err)
    req.answers = answers
    req.situation = generateSituation(answers)
    next()
  })
}

exports.attachAccessCookie = function (req, res) {
  const maxAge = 7 * 24 * 3600 * 1000
  res.cookie(req.answers.cookieName, req.answers.token, {
    maxAge,
    httpOnly: true,
  })
  res.cookie("lastestSituation", req.answers._id.toString(), { maxAge })
}

exports.validateAccess = function (req, res, next) {
  if (req.answers.isAccessible(req.cookies)) return next()
  res.status(403).send({ error: "You do not have access to this situation." })
}

exports.show = function (req, res) {
  res.send(req.answers)
}

function clearCookies(req, res) {
  const limit = 10

  const keys = Object.keys(req.cookies)
  const situationCookies = filter(keys, function (k) {
    return k.startsWith(Answers.cookiePrefix)
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

  return Answers.create(
    omit(req.body, "createdAt", "status", "token"),
    (err, persistedAnswers) => {
      if (err) return next(err)

      clearCookies(req, res)
      req.answers = persistedAnswers
      exports.attachAccessCookie(req, res)
      res.send(persistedAnswers)
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

    res.send(Object.assign(result, { _id: req.situationId }))
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
