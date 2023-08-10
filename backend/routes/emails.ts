import emailController from "../controllers/emails.js"
import { followup } from "../controllers/followups.js"
import { Express } from "express"

const emailRoutes = function (api: Express) {
  api.param("followupId", followup)
  api.get("/email/followups/:followupId", emailController.getFollowupEmail)
}
export default emailRoutes
