import cors from "cors"
import {
  benefits,
  countSimulationByBikeTypeNumber,
  countSimulationByBikeTypeNumberByBikeType,
  institutions,
} from "../controllers/data.js"

const dataRoutes = function (api) {
  api.route("/benefits").get(cors({ origin: "*" }), benefits)
  api.route("/institutions").get(cors({ origin: "*" }), institutions)
  api
    .route("/count-by-bike-types-number")
    .get(cors({ origin: "*" }), countSimulationByBikeTypeNumber)
  api
    .route("/count-simulation-by-bike-type-number-by-bike-type")
    .get(cors({ origin: "*" }), countSimulationByBikeTypeNumberByBikeType)
}
export default dataRoutes
