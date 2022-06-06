//const bodyParser = require("body-parser")
const axios = require("axios")
const outils = require("./backend/controllers/outils")
const mapping = require("./backend/lib/openfisca/mapping")
const openfiscaParameters = require("./backend/lib/openfisca/parameters.js")
const pollResult = require("./backend/lib/mattermost-bot/poll-result")
const { generateSituation } = require("./lib/situations")

const openfiscaRoot = "https://openfisca.mes-aides.1jeune1solution.beta.gouv.fr"
const buildOpenFiscaRequest = mapping.buildOpenFiscaRequest
function sendToOpenfisca(situation, callback) {
  let request
  try {
    request = buildOpenFiscaRequest(situation)
  } catch (e) {
    return callback({
      message: e.message,
      name: e.name,
      stack: e.stack,
    })
  }
  axios
    .post(`${openfiscaRoot}/calculate`, request)
    .then((response) => response.data)
    .then((result) => {
      callback(null, result)
    })
    .catch(callback)
}

const ID = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return "_" + Math.random().toString(36).substr(2, 9)
}

function mock({ app }) {
  app.use(bodyParser.json())

  let cache = {}
  app.route("/api/outils/communes/:codePostal").get(outils.communes)
  app.post("/api/simulation", function (req, res) {
    const data = Object.assign({ _id: ID() }, req.body)
    cache[data._id] = data
    res.send(data)
  })

  app.get("/api/simulation/:id", function (req, res) {
    res.send(cache[req.params.id])
  })

  app.get("/api/simulation/:id/openfisca-response", function (req, res, next) {
    try {
      const simulation = cache[req.params.id]
      const situation = generateSituation(simulation)
      sendToOpenfisca(situation, function (err, result) {
        if (err) {
          return next(err)
        }
        res.send(Object.assign({ _id: cache[req.params.id]._id }, result))
      })
    } catch {
      res.sendStatus(404)
    }
  })

  app.get("/api/simulation/:id/openfisca-request", function (req, res) {
    try {
      const simulation = cache[req.params.id]
      const situation = generateSituation(simulation)
      res.send(buildOpenFiscaRequest(situation))
    } catch {
      res.sendStatus(404)
    }
  })

  app.get("/api/openfisca/missingbenefits", function (req, res) {
    res.send([])
  })

  app.get("/api/openfisca/parameters/:timestamp", function (req, res) {
    res.send(openfiscaParameters.parametersList)
  })

  app.get("/api/followups/surveys/:id", function (req, res) {
    res.send({
      benefits: [
        { id: "ppa", amount: 42 },
        { id: "rsa", amount: 145 },
        { id: "aide_logement", amount: 125 },
      ],
    })
  })

  app.post("/api/followups/surveys/:id/answers", function (req, res) {
    pollResult.postPollResult({ _id: "mock-id" }, req.body)
    res.sendStatus(201)
  })

  app.use(function (err, req, res, next) {
    res
      .status(err.response?.status || 500)
      .send(err.response?.data || err.message || err.error || err)
    next()
  })
}

module.exports = mock
