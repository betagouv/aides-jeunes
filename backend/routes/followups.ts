import cookieParser from "cookie-parser"
import {
  followupByAccessToken,
  postSurvey,
  showSurveyResult,
  showSurveyResults,
  showSurveyResultByEmail,
  getFollowup,
  logSurveyLinkClick,
} from "../controllers/followups.js"
import githubController from "../controllers/github.js"

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
    .route("/followups/surveys/:accessToken/:surveyType")
    .get(logSurveyLinkClick)
  api.param("accessToken", followupByAccessToken)
}
export default followupsRoutes
