import cookieParser from "cookie-parser"
import githubController from "../controllers/github.js"

export default function (api) {
  api
    .route("/auth/redirect")
    .get(cookieParser(), githubController.access)
    .get(githubController.postAuthRedirect)
}
