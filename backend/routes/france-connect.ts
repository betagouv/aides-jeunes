import cookieParser from "cookie-parser"
import * as franceConnectController from "../controllers/france-connect.js"
import { Express } from "express"

export default function (api: Express) {
  api.route("/france-connect/login").get(franceConnectController.login)

  api
    .route("/france-connect/callback")
    .get(
      cookieParser(),
      franceConnectController.callback,
      franceConnectController.fetchUserInfo
    )

  api
    .route("/france-connect/logout")
    .get(cookieParser(), franceConnectController.logout)

  api
    .route("/france-connect/logout-callback")
    .get(cookieParser(), franceConnectController.logoutCallback)
}
