import cookieParser from "cookie-parser"
import githubController from "../controllers/github"

export default (api) => {
  api
    .route("/auth/redirect")
    .get(cookieParser(), githubController.access)
    .get(githubController.postAuthRedirect)
}
