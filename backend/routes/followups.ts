import cookieParser from "cookie-parser"
import {
  showFromSurvey,
  postAnswersSurvey,
  showSurveyResult,
  showSurveyResults,
  showSurveyResultByEmail,
  getFollowup,
  updateWasUseful,
} from "../controllers/followups"
import githubController from "../controllers/github"

const followupsRoutes = function (api) {
  api.route("/followups/surveys/:surveyId").get(showFromSurvey)
  api.route("/followups/surveys/:accessToken/answers").post(postAnswersSurvey)
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
  api
    .route("/followups/surveys/:accessToken/wasuseful/:wasuseful")
    .patch(updateWasUseful)
  api.param("accessToken", getFollowup)
}
export default followupsRoutes
