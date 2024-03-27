import cookieParser from "cookie-parser"
import moncompteproController from "../controllers/moncomptepro.js"
import { Express } from "express"

export default (api: Express) => {
  api
    .route("/auth/redirect")
    .get(cookieParser(), moncompteproController.access)
    .get(moncompteproController.postAuthRedirect)
}
