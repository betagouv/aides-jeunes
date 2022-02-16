const followups = require("../controllers/followups")

module.exports = function (api) {
  api.route("/followups/surveys/:surveyId").get(followups.showFromSurvey)
  api.route("/followups/surveys/:surveyId/answers").post(followups.postSurvey)
  api.route("/followups/surveys").get(followups.showSurveyResults)
  api.route("/followups/id/:simulationId").get(followups.showSimulation)
}
