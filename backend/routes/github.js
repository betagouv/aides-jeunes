const githubController = require("../controllers/github")

module.exports = function (api) {
  api.route("/user/signin/callback").get(githubController.callbackGithub)
}
