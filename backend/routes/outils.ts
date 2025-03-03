import outils from "../controllers/outils.js"
import { Express } from "express"

export default function (api: Express) {
  api.route("/outils/communes/:codePostal").get(outils.communes)
}
