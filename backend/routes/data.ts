import cors from "cors"
import { benefits, institutions } from "../controllers/data.js"

const dataRoutes = function (api) {
  api.route("/benefits").get(cors({ origin: "*" }), benefits)
  api.route("/institutions").get(cors({ origin: "*" }), institutions)
}
export default dataRoutes
