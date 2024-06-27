import cookieParser from "cookie-parser"
import moncompteproController from "../controllers/moncomptepro.js"
import { Express } from "express"
import jwt from "jsonwebtoken"

const moncompteproRoutes = function (api: Express) {
  api.get("/login", moncompteproController.login)
  api.get(
    "/auth/redirect",
    cookieParser(),
    moncompteproController.checkNetlify,
    moncompteproController.access,
    moncompteproController.loginCallbackRedirect
  )
  api.get("/logout", moncompteproController.logout)
}
export default moncompteproRoutes
