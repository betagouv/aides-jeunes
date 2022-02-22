const followups = require("../controllers/followups")
const githubController = require("../controllers/github")
const cookieParser = require("cookie-parser")

module.exports = function (api) {
  api.route("/followups/surveys/:surveyId").get(followups.showFromSurvey)
  api.route("/followups/surveys/:surveyId/answers").post(followups.postSurvey)
  api
    .route("/followups/surveys")
    .get(cookieParser(), githubController.access)
    .get(followups.showSurveyResults)
  api
    .route("/followups/id/:followingId")
    .get(cookieParser(), githubController.access)
    .get(followups.showSimulation)
}
