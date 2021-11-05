const outils = require("../controllers/outils")

module.exports = function (api) {
  api.route("/outils/communes/:codePostal").get(outils.communes)
}
