const config = require("../../config")
const mapping = require("./mapping")
const axios = require("axios")

const buildOpenFiscaRequest = (exports.buildOpenFiscaRequest =
  mapping.buildOpenFiscaRequest)
function sendToOpenfisca(endpoint, transform) {
  if (!transform) {
    transform = buildOpenFiscaRequest
  }

  return function (situation, callback) {
    let request
    try {
      request = transform(situation)
    } catch (e) {
      return callback({
        message: e.message,
        name: e.name,
        stack: e.stack,
      })
    }

    axios
      .post(config.openfiscaURL + "/" + endpoint, request)
      .then((response) => response.data)
      .then(function (result) {
        callback(null, result)
      })
      .catch(callback)
  }
}

exports.calculate = sendToOpenfisca("calculate")
exports.trace = sendToOpenfisca("trace")
exports.sendToOpenfisca = sendToOpenfisca
