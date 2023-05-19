import emailController from "../controllers/emails.js"

const emailRoutes = function (api) {
  api.get("/email/:token", emailController.getEtmail)
}
export default emailRoutes
