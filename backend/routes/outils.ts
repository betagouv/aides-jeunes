import outils from "../controllers/outils.js"

export default function (api) {
  api.route("/outils/communes/:codePostal").get(outils.communes)
}
