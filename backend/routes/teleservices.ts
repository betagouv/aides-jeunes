import teleservices from "../controllers/teleservices/index.js"

export default function (api) {
  api.route("/teleservices").get(teleservices.list)
}
