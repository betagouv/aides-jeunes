import teleservices from "../controllers/teleservices/index.js"
import { Express } from "express"

export default function (api: Express) {
  api.route("/teleservices").get(teleservices.list)
}
