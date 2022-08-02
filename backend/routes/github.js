const cookieParser = require("cookie-parser")
const githubController = require("../controllers/github")

module.exports = function (api) {
  api
    .route("/auth/redirect")
    .get(cookieParser(), githubController.access)
    .get(githubController.postAuthRedirect)
}
