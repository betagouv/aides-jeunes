import { Application } from "express"

import api from "./api.js"
import followupRedirectRoute from "../routes/followup-redirect.js"
import short from "../routes/short.js"
import netlify from "../routes/netlify.js"

export function loadRoutes(app: Application): void {
  app.use("/api", api)
  app.use("/followups", followupRedirectRoute)
  app.use("/s", short)
  app.use("/.netlify/identity", netlify)
}
