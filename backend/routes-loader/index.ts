import { Application } from "express"

import api from "./api.js"
import emailFollowupRedirectRoute from "../routes/email-followup-redirect.js"

export function loadRoutes(app: Application): void {
  app.use("/api", api)
  app.use("/followups", emailFollowupRedirectRoute)
}
