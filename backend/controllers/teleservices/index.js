const auth = require("basic-auth")
const answers = require("../answers")
const jwt = require("jsonwebtoken")
const moment = require("moment")
const Mustache = require("mustache")

const config = require("../../config")
const Loiret = require("../../lib/teleservices/loiret")
const OpenFiscaAxe = require("../../lib/teleservices/openfisca-axe")
const OpenFiscaResponse = require("../../lib/teleservices/openfisca-response")
const OpenFiscaTracer = require("../../lib/teleservices/openfisca-tracer")
const PNDS = require("../../lib/teleservices/pnds")

moment.locale("fr")

const teleservices = [
  {
    name: "loiret_APA_test",
    class: Loiret,
    destination: {
      label: "Accéder au téléservice du Loiret (test)",
      url: "https://reflexe45-test.loiret.fr/public/requestv2/accountless/teleprocedure_id/92?situation={{token}}",
    },
  },
  {
    name: "loiret_APA",
    class: Loiret,
    destination: {
      label: "Accéder au téléservice du Loiret",
      url: "https://services.loiret.fr/public/requestv2/accountless/teleprocedure_id/264?situation={{token}}",
    },
  },
  {
    name: "ccas_saint_louis_preprod",
    class: OpenFiscaResponse,
    public: true,
    destination: {
      label: "Transférer les informations",
      url: "https://agrums-acadis-connect/agrum/analyse-des-droits/{{token}}",
    },
  },
  {
    name: "openfisca_tracer",
    class: OpenFiscaTracer,
    public: true,
    destination: {
      label: "en ligne",
      url: "{{&openfiscaTracerURL}}/?source={{&baseURL}}/api/answers/via/{{token}}&host={{&openFiscaURL}}",
    },
  },
  {
    name: "openfisca_axe",
    class: OpenFiscaAxe,
    public: true,
    destination: {
      url: "{{&openfiscaAxeURL}}/graphique?source={{&baseURL}}/api/answers/via/{{token}}",
    },
  },
  {
    name: "PNDS",
    class: PNDS,
    destination: {
      url: "https://www.mesdroitssociaux.gouv.fr?token={{token}}",
    },
  },
]

function createClass(teleservice, situation) {
  // Create object dynamically, and apply constructor
  const ts = Object.create(teleservice.class.prototype)
  teleservice.class.apply(ts, [situation])

  return ts
}

exports.names = teleservices.map(function (ts) {
  return ts.name
})

/*
 * Express callback to expose teleservice data
 */
exports.list = function (req, res) {
  res.json(teleservices)
}

const teleserviceMap = teleservices.reduce(function (obj, ts) {
  obj[ts.name] = ts
  return obj
}, {})

function fail(res, msg) {
  return res.status(400).send({ error: msg })
}

/*
 * Each teleservice requires a specific representation of the situation.
 * Users needs to know what data is made available to third parties.
 * This function generated endpoint callback that respond
 * - decorated data with metadata for display and
 * - the appropriate URL to third party teleservice.
 */
exports.metadataResponseGenerator = function (teleservice) {
  return function (req, res) {
    const payload = {
      id: req.answers._id,
      scope: teleservice.name,
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // Expires after one hour
    }

    const token = jwt.sign(payload, req.answers.token)

    return res.json({
      fields: createClass(teleservice, req.situation).toInternal(),
      destination: {
        label: teleservice.destination.label,
        url: Mustache.render(teleservice.destination.url, {
          token: token,
          baseURL: req.protocol + "://" + req.get("host"),
          openfiscaAxeURL: config.openfiscaAxeURL,
          openFiscaURL: config.openfiscaPublicURL,
          openfiscaTracerURL: config.openfiscaTracerURL,
        }),
      },
    })
  }
}

/*
 * This callback attachs
 * - the token sent (a JWT)
 * - the decoded token as payload (generated in metadataResponseGenerator)
 * - the appropriate teleservice using the scope name
 */
exports.decodePayload = function (req, res, next, token) {
  req.token = token
  req.payload = jwt.decode(token)
  if (!req.payload) return fail(res, "Corrupted payload")
  if (!req.payload.scope || !teleserviceMap[req.payload.scope])
    return fail(res, "Invalid scope")

  req.teleservice = teleserviceMap[req.payload.scope]
  next()
}

const tokens = config.teleserviceAccessTokens || {}
/*
 * This callback validates the basic authorization cookie content
 */
exports.checkCredentials = function (req, res, next) {
  if (req.teleservice.public) {
    next()
    return
  }

  const credentials = auth(req)
  if (
    !credentials ||
    !tokens[credentials.name] ||
    credentials.pass != tokens[credentials.name]
  ) {
    res
      .status(401)
      .setHeader("WWW-Authenticate", 'Basic realm="MesAidesTeleservices"')
    res.send({ error: "Not autorized" })
  } else {
    next()
  }
}

/*
 * This callback attachs the appropriate answers
 * It requires a payload with an identifier
 */
exports.attachPayloadSituation = function (req, res, next) {
  answers.answers(req, res, next, req.payload.id)
}

/*
 * This callback validates user consent to share data with the third party
 * * The consent is considered given if the token is signed by the token attached to the situation
 * It requires a situation
 */
exports.verifyRequest = function (req, res, next) {
  jwt.verify(req.token, req.answers.token, function (err) {
    if (err) {
      return fail(res, err)
    }
    next()
  })
}

/*
 * This function returns a key/value object representing the requested situation to prefill a specific teleservice.
 * At the moment, the key/value pairs are hardcoded but it mimics the expected behavior.
 */
exports.exportRepresentation = function (req, res) {
  return Promise.resolve(
    createClass(req.teleservice, req.situation).toExternal()
  ).then(function (value) {
    return res.json(value)
  })
}

for (let i = 0; i < teleservices.length; i++) {
  exports[teleservices[i].name] = teleservices[i]
}
