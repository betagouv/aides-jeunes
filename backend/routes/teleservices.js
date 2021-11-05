const teleservices = require("../controllers/teleservices")

module.exports = function (api) {
  api.route("/teleservices").get(teleservices.list)
}
