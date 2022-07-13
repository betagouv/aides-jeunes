import outils from "../controllers/outils"

export default function (api) {
  api.route("/outils/communes/:codePostal").get(outils.communes)
}
