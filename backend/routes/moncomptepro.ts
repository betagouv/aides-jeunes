import cookieParser from "cookie-parser"
import moncompteproController from "../controllers/moncomptepro.js"
import { Express } from "express"

const moncompteproRoutes = function (api: Express) {
  api.get("/login", cookieParser(), moncompteproController.login)
  api.get(
    "/auth/redirect",
    cookieParser(),
    moncompteproController.access,
    moncompteproController.loginCallbackRedirect
  )
  api.get("/logout", moncompteproController.logout)
}
export default moncompteproRoutes
