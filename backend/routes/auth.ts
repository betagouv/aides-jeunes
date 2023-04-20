import cookieParser from "cookie-parser"
import * as fc from "../controllers/france-connect.js"

export default function (api) {
  api.route("/auth/login").get(fc.login)
  api.route("/auth/callback").get(cookieParser(), fc.callback, fc.fetchUserInfo)
  api.route("/auth/logout").get(cookieParser(), fc.logout)
  api.route("/auth/logout-callback").get(cookieParser(), fc.logoutCallback)
}
