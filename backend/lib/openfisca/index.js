var config = require("../../config")
var mapping = require("./mapping")
var axios = require("axios")

var buildOpenFiscaRequest = (exports.buildOpenFiscaRequest =
  mapping.buildOpenFiscaRequest)
function sendToOpenfisca(endpoint, transform) {
  if (!transform) {
    transform = buildOpenFiscaRequest
  }

  return function (situation, callback) {
    var request
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

exports.get = function (item, callback) {
  axios
    .get(`${config.openfiscaURL}${item}`)
    .then((response) => response.data)
    .then(function (result) {
      callback(result)
    })
}
