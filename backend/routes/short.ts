import { followupByAccessToken } from "../controllers/followups.js"
import { Express } from "express"

export default function (api: Express) {
  api.param("accessToken", followupByAccessToken)
  api.route("/:type/:accessToken").get((req, res) => {
    switch (params.type) {
      case "r": // resultats
        return res.redirect(req.followup.returnPath)
      case "s": // survey
        return res.redirect(req.followup.smsSurveyPath)
    }
  })
}
