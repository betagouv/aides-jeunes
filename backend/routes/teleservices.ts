import teleservices from "../controllers/teleservices/index"

export default function (api) {
  api.route("/teleservices").get(teleservices.list)
}
