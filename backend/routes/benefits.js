const benefits = require("../controllers/benefits")
const cors = require("cors")

module.exports = function (api) {
  api.route("/benefits").get(cors({ origin: "*" }), benefits.list)
}
