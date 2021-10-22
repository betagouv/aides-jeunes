var omit = require("lodash/omit")
var filter = require("lodash/filter")
var pick = require("lodash/pick")
var assign = require("lodash/assign")

var openfisca = require("../lib/openfisca")
var openfiscaTest = require("../lib/openfisca/test")
var Situation = require("mongoose").model("Situation")
var Answer = require("mongoose").model("Answer")

exports.situation = function (req, res, next, situationId) {
  if (situationId && situationId._id) {
    req.situation = situationId
    return next()
  }

  Situation.findById(situationId, function (err, situation) {
    if (err) return next(err)
    if (!situation) return res.sendStatus(404)

    req.situation = situation
    Answer.findById(situationId, (err, answers) => {
      if (err) return next(err)
      req.answers = answers
      next()
    })
  })
}

exports.attachAccessCookie = function (req, res) {
  const maxAge = 7 * 24 * 3600 * 1000
  res.cookie(req.situation.cookieName, req.situation.token, {
    maxAge,
    httpOnly: true,
  })
  res.cookie("lastestSituation", req.situation._id.toString(), { maxAge })
}

exports.validateAccess = function (req, res, next) {
  if (req.situation.isAccessible(req.cookies)) return next()
  res.status(403).send({ error: "You do not have access to this situation." })
}

exports.show = function (req, res) {
  res.send(req.answers)
}

function clearCookies(req, res) {
  var limit = 10

  var keys = Object.keys(req.cookies)
  var situationCookies = filter(keys, function (k) {
    return k.startsWith(Situation.cookiePrefix)
  })
  situationCookies.sort()

  if (situationCookies.length - limit >= 0) {
    var cookieToClear = situationCookies.slice(
      0,
      situationCookies.length - limit
    )
    cookieToClear.forEach(function (name) {
      res.clearCookie(name, { httpOnly: true })
    })
  }
}

exports.createWithAnswers = function (req, res, next) {
  if (req.body.situation._id)
    return res.status(403).send({
      error:
        "You can‘t provide _id when saving a situation. _id will be generated automatically.",
    })

  return Situation.create(
    omit(req.body.situation, "createdAt", "status", "token"),
    function (err, persistedSituation) {
      if (err) return next(err)

      req.body.answers._id = persistedSituation._id
      Answer.create(req.body.answers, (err) => {
        if (err) return next(err)

        clearCookies(req, res)
        req.situation = persistedSituation
        exports.attachAccessCookie(req, res)
        res.send(persistedSituation)
      })
    }
  )
}

exports.openfiscaResponse = function (req, res, next) {
  return openfisca.calculate(req.situation, function (err, result) {
    if (err)
      return next(
        Object.assign((err.response && err.response.data) || err, {
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

var DETAILS_DEFAULT_ATTRIBUTES = {
  absolute_error_margin: 10,
}

// Attributes are sorted as they should appear in the YAML test file
var DETAILS_ATTRIBUTES = [
  "name",
  "description",
  "extension",
  "absolute_error_margin",
  "relative_error_margin",
  "output",
]

exports.openfiscaTest = function (req, res) {
  var details = assign(
    {},
    DETAILS_DEFAULT_ATTRIBUTES,
    pick(req.body, DETAILS_ATTRIBUTES)
  )
  if (!details.name || !details.description || !details.output) {
    return res
      .status(403)
      .send({ error: "You must provide a name, description and output." })
  }

  var situation = req.situation.toObject
    ? req.situation.toObject()
    : req.situation
  res.type("yaml").send(openfiscaTest.generateYAMLTest(details, situation))
}
