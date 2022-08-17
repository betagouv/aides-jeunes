import auth from "basic-auth"
import simulationController from "../simulation.js"
import jwt from "jsonwebtoken"
import Mustache from "mustache"

import config from "../../config/index.js"
import { AidesJeunesPreremplissage } from "../../lib/teleservices/aides-jeunes-preremplissage.js"
import OpenFiscaAxe from "../../lib/teleservices/openfisca-axe.js"
import OpenFiscaResponse from "../../lib/teleservices/openfisca-response.js"
import OpenFiscaTracer from "../../lib/teleservices/openfisca-tracer.js"
import PNDS from "../../lib/teleservices/pnds.js"
import AidesJeunesServiceLogement from "../../lib/teleservices/aides-jeunes-service-logement.js"
import dayjs from "dayjs"
import "dayjs/locale/fr.js"

dayjs.locale("fr")

const teleservices = [
  {
    class: OpenFiscaResponse,
    destination: {
      label: "Transférer les informations",
      url: "https://agrums.acadis.re/agrum/analyse-des-droits/{{token}}",
    },
    name: "ccas_saint_louis_preprod",
    public: true,
  },
  {
    class: OpenFiscaTracer,
    destination: {
      label: "en ligne",
      url: "{{&openfiscaTracerURL}}/?source={{&baseURL}}/api/simulation/via/{{token}}&host={{&openFiscaURL}}",
    },
    name: "openfisca_tracer",
    public: true,
  },
  {
    class: OpenFiscaAxe,
    destination: {
      url: "{{&openfiscaAxeURL}}/graphique?source={{&baseURL}}/api/simulation/via/{{token}}",
    },
    name: "openfisca_axe",
    public: true,
  },
  {
    class: PNDS,
    destination: {
      url: "https://www.mesdroitssociaux.gouv.fr?token={{token}}",
    },
    name: "PNDS",
  },
  {
    class: AidesJeunesPreremplissage,
    destination: {
      url: "http://localhost:3000/preremplissage/resultats?token={{token}}",
    },
    name: "aides_jeunes_preremplissage_dev",
    public: true,
  },
  {
    class: AidesJeunesServiceLogement,
    destination: {
      url: "http://localhost:3000/service-logement?token={{token}}",
    },
    name: "aides_jeunes_service_logement_dev",
    public: true,
  },
  {
    class: AidesJeunesPreremplissage,
    destination: {
      url: "https://aides-jeunes-experimentations.netlify.app/preremplissage/resultats?token={{token}}",
    },
    name: "aides_jeunes_preremplissage",
    public: true,
  },
  {
    class: AidesJeunesServiceLogement,
    destination: {
      url: "https://aides-jeunes-experimentations.netlify.app/service-logement?token={{token}}",
    },
    name: "aides_jeunes_service_logement",
    public: true,
  },
]

function createClass(teleservice, simulation) {
  // Create object dynamically, and apply constructor
  const ts = Object.create(teleservice.class.prototype)
  teleservice.class.apply(ts, [simulation])

  return ts
}

const names = teleservices.map(function (ts) {
  return ts.name
})

/*
 * Express callback to expose teleservice data
 */
function list(req, res) {
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
function metadataResponseGenerator(teleservice) {
  return function (req, res) {
    const payload = {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      id: req.simulation._id,
      scope: teleservice.name, // Expires after one hour
    }

    const token = jwt.sign(payload, req.simulation.token)

    return res.json({
      destination: {
        label: teleservice.destination.label,
        url: Mustache.render(teleservice.destination.url, {
          baseURL: `${req.protocol}://${req.get("host")}`,
          openfiscaAxeURL: config.openfiscaAxeURL,
          openfiscaTracerURL: config.openfiscaTracerURL,
          openFiscaURL: config.openfiscaPublicURL,
          token: token,
        }),
      },
      fields: createClass(teleservice, req.simulation).toInternal(),
    })
  }
}

/*
 * This callback attachs
 * - the token sent (a JWT)
 * - the decoded token as payload (generated in metadataResponseGenerator)
 * - the appropriate teleservice using the scope name
 */
function decodePayload(req, res, next, token) {
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
function checkCredentials(req, res, next) {
  if (req.teleservice.public) {
    next()
    return
  }

  const credentials = auth(req)
  if (
    !credentials ||
    !tokens[req.teleservice.name] ||
    credentials.name != req.teleservice.name ||
    credentials.pass != tokens[req.teleservice.name]
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
 * This callback attachs the appropriate simulation
 * It requires a payload with an identifier
 */
function attachPayloadSituation(req, res, next) {
  simulationController.simulation(req, res, next, req.payload.id)
}

/*
 * This callback validates user consent to share data with the third party
 * * The consent is considered given if the token is signed by the token attached to the situation
 * It requires a situation
 */
function verifyRequest(req, res, next) {
  jwt.verify(req.token, req.simulation.token, function (err) {
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
function exportRepresentation(req, res) {
  return Promise.resolve(
    createClass(req.teleservice, req.simulation).toExternal(req)
  ).then(function (value) {
    return res.json(value)
  })
}

const teleservicesExports = {
  attachPayloadSituation,
  checkCredentials,
  decodePayload,
  exportRepresentation,
  list,
  metadataResponseGenerator,
  names,
  verifyRequest,
}
for (let i = 0; i < teleservices.length; i++) {
  teleservicesExports[teleservices[i].name] = teleservices[i]
}

export default teleservicesExports
