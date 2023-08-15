import cors from "cors"
import { benefits, institutions } from "../controllers/data.js"
import { Express } from "express"

const dataRoutes = function (api: Express) {
  api.route("/benefits").get(cors({ origin: "*" }), benefits)
  api.route("/institutions").get(cors({ origin: "*" }), institutions)
}
export default dataRoutes
