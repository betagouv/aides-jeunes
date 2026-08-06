import config from "../../config/index.js"
import mapping from "./mapping/index.js"
import axios from "axios"
import * as Sentry from "@sentry/node"

export const buildOpenFiscaRequest = mapping.buildOpenFiscaRequest

// Le corps d'erreur remonte jusqu'au client et jusqu'aux logs. Un AxiosError
// brut y ferait figurer `config.data`, c'est-à-dire la situation personnelle
// complète, ainsi que les chemins du serveur.
//
// Le résultat doit toujours être vrai : les appelants suivent la convention
// `callback(err, result)` et testent `if (err)`. Une réponse d'erreur HTTP à
// corps vide donne `response.data === ""`, qu'il faut donc écarter.
function normalizeError(err: any) {
  const body = err.response?.data
  if (body) {
    return body
  }

  return {
    name: err.name || "Error",
    code: err.code,
    status: err.response?.status,
    // Le message d'axios porte l'adresse interne du service sur les erreurs
    // réseau. Seul celui d'un abandon est sûr, et le front s'en sert pour
    // reconnaître un calcul trop long.
    message:
      err.code === "ECONNABORTED"
        ? err.message
        : "Le calcul n'a pas abouti. Merci de réessayer dans un instant.",
  }
}

export function sendToOpenfisca(endpoint, transform?: any) {
  if (!transform) {
    transform = buildOpenFiscaRequest
  }

  return function (situation, callback) {
    let request
    try {
      request = transform(situation)
    } catch (e: any) {
      Sentry.captureException(e)
      return callback(normalizeError(e))
    }

    axios
      .post(`${config.openfiscaURL}/${endpoint}`, request, {
        timeout: config.openfiscaTimeout,
      })
      .then((response) => {
        // Une réponse vide n'est pas un résultat : la laisser passer ferait
        // échouer le calcul des aides plus loin, hors du chemin d'erreur.
        if (!response.data) {
          throw Object.assign(new Error("Empty response from OpenFisca"), {
            code: "ERR_EMPTY_RESPONSE",
          })
        }
        return response.data
      })
      .then(function (result) {
        callback(null, result)
      })
      .catch((err) => callback(normalizeError(err)))
  }
}

export const calculate = sendToOpenfisca("calculate")
export const trace = sendToOpenfisca("trace")

export default {
  buildOpenFiscaRequest,
  calculate,
  trace,
  sendToOpenfisca,
}
