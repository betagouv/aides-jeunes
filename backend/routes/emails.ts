import emailController from "../controllers/emails.js"
import { followup } from "../controllers/followups.js"

const emailRoutes = function (api) {
  api.param("followupId", followup)
  api.get("/email/followups/:followupId", emailController.getFollowupEmail)
}
export default emailRoutes
