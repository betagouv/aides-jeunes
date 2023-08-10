import cookieParser from "cookie-parser"
import githubController from "../controllers/github.js"
import { Express } from "express"

export default (api: Express) => {
  api
    .route("/auth/redirect")
    .get(cookieParser(), githubController.access)
    .get(githubController.postAuthRedirect)
}
