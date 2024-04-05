import { followupByAccessToken } from "../controllers/followups.js"
import express from "express"

const route = express()

route.param("accessToken", followupByAccessToken)
route.get("/:type/:accessToken", (req, res) => {
  switch (req.params.type) {
    case "r": // resultats
      return res.redirect(req.followup.returnPath)
    case "s": // survey
      return res.redirect(req.followup.smsSurveyPath)
    case "t": // temporary simulation recap
      return res.redirect(req.followup.recapSurveyPath)
  }
})

export default route
