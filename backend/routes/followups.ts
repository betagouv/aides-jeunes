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
import moncompteproController from "../controllers/moncomptepro.js"

const followupsRoutes = function (api: Express) {
  api.route("/followups/surveys/:accessToken").get(getFollowupDataForSurvey)
  api
    .route("/followups/surveys/:accessToken/answers")
    .post(express.json(), postSurvey)
  api
    .route("/followups/surveys")
    .get(cookieParser(), moncompteproController.access)
    .get(showSurveyResults)
  api
    .route("/followups/id/:surveyId")
    .get(cookieParser(), moncompteproController.access)
    .get(showFollowup)
  api
    .route("/followups/email/:email")
    .get(cookieParser(), moncompteproController.access)
    .get(showSurveyResultByEmail)
  api
    .route("/followups/surveys/:accessToken/:surveyType")
    .get(logSurveyLinkClick)
  api.param("accessToken", followupByAccessToken)
}
export default followupsRoutes
