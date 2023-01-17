import cookieParser from "cookie-parser"
import {
  findFollowupByAccessToken,
  postSurvey,
  showSurveyResult,
  showSurveyResults,
  showSurveyResultByEmail,
  getFollowup,
  updateWasUseful,
} from "../controllers/followups"
import githubController from "../controllers/github"

const followupsRoutes = function (api) {
  api.route("/followups/surveys/:accessToken").get(getFollowup)
  api.route("/followups/surveys/:accessToken/answers").post(postSurvey)
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
    .get(updateWasUseful)
  api.param("accessToken", followupByAccessToken)
}
export default followupsRoutes
