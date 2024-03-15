import express from "express"
import {
  followup,
  resultRedirect,
  recapRedirect,
  followupByAccessToken,
} from "../controllers/followups.js"

const route = express()

route.param("followupId", followup)
route.param("accessToken", followupByAccessToken)
route.get("/:followupId", resultRedirect)
route.get("/recap/:accessToken", recapRedirect)

export default route
