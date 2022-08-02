import cors from "cors"
import benefits from "../controllers/benefits.js"

const benefitsRoutes = function (api) {
  api.route("/benefits").get(cors({ origin: "*" }), benefits)
}
export default benefitsRoutes
