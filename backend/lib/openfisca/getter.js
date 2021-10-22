var axios = require("axios")
var config = require("../../config")

exports.get = function (item, callback) {
  axios
    .get(`${config.openfiscaURL}${item}`)
    .then((response) => response.data)
    .then(function (result) {
      callback(result)
    })
}

exports.getPromise = async (item) =>
  axios.get(`${config.openfiscaURL}${item}`).then((response) => response.data)
