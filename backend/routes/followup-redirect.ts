import express from "express"
import { followup } from "../controllers/followups.js"
import {
  attachAccessCookie,
  redirectToResults,
} from "../controllers/simulation.js"

const route = express()

route.param("followupId", followup)
route.get("/:followupId", attachAccessCookie, redirectToResults)

export default route
