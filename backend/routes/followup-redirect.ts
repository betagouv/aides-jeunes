import express from "express"
import {
  followup,
  resultRedirect,
  recapRedirect,
} from "../controllers/followups.js"

const route = express()

route.param("followupId", followup)
route.get("/:followupId", resultRedirect)
route.get("/recap/:followupId", recapRedirect)

export default route
