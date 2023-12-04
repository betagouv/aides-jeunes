import cookieParser from "cookie-parser"
import express, { Express } from "express"

import {
  followupByAccessToken,
  postSurvey,
  showFollowup,
  showSurveyResults,
  showSurveyResultByEmail,
  getFollowupDataForSurvey,
  logSurveyLinkClick,
} from "../controllers/followups.js"
import githubController from "../controllers/github.js"

const followupsRoutes = function (api: Express) {
  api.route("/followups/surveys/:accessToken").get(getFollowupDataForSurvey)
  api
    .route("/followups/surveys/:accessToken/answers")
    .post(express.json(), postSurvey)
  api
    .route("/followups/surveys")
    .get(cookieParser(), githubController.access)
    .get(showSurveyResults)
  api
    .route("/followups/id/:surveyId")
    .get(cookieParser(), githubController.access)
    .get(showFollowup)
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
