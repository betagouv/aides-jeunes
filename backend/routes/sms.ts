import {
  followupByAccessToken,
  smsSurveyLinkClick,
} from "../controllers/followups.js"
import { Express } from "express"

export default function (api: Express) {
  api.param("accessToken", followupByAccessToken)
  api
    .route("/sms/:accessToken")
    .get((req, res) => res.redirect(req.followup.returnPath))
  api.route("/r/:accessToken").get(smsSurveyLinkClick) // r = redirection (sms needs short message length)
}
