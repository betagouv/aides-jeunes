import express from "express"
import { followup, resultRedirect } from "../controllers/followups.js"

const route = express()

route.param("followupId", followup)
route.get("/:followupId", resultRedirect)

export default route
