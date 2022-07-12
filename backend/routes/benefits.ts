import cors from "cors"
import benefits from "../controllers/benefits.js"

module.exports = function (api) {
  api.route("/benefits").get(cors({ origin: "*" }), benefits)
}
