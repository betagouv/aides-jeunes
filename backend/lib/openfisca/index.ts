import config from "../../config/index"
import mapping from "./mapping/index"
import axios from "axios"

export const buildOpenFiscaRequest = mapping.buildOpenFiscaRequest

export function sendToOpenfisca(endpoint, transform?: any) {
  if (!transform) {
    transform = buildOpenFiscaRequest
  }

  return function (situation, callback) {
    let request
    try {
      request = transform(situation)
    } catch (e: any) {
      return callback({
        message: e.message,
        name: e.name,
        stack: e.stack,
      })
    }

    axios
      .post(`${config.openfiscaURL}/${endpoint}`, request)
      .then((response) => response.data)
      .then(function (result) {
        callback(null, result)
      })
      .catch(callback)
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
