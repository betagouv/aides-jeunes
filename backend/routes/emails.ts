import emailController from "../controllers/emails.js"

const emailRoutes = function (api) {
  api.get("/email/followups/:followupId", emailController.getEtmail)
}
export default emailRoutes
