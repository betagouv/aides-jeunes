import cookieParser from "cookie-parser"
import {
  showFromSurvey,
  postSurvey,
  showSurveyResult,
  showSurveyResults,
  showSurveyResultByEmail,
} from "../controllers/followups"
import githubController from "../controllers/github"

const followupsRoutes = function (api) {
  api.route("/followups/surveys/:surveyId").get(showFromSurvey)
  api.route("/followups/surveys/:surveyId/answers").post(postSurvey)
  api
    .route("/followups/surveys")
    .get(cookieParser(), githubController.access)
    .get(showSurveyResults)
  api
    .route("/followups/id/:surveyId")
    .get(cookieParser(), githubController.access)
    .get(showSurveyResult)
  api
    .route("/followups/email/:email")
    .get(cookieParser(), githubController.access)
    .get(showSurveyResultByEmail)
}
export default followupsRoutes
