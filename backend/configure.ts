import express from "express"
import morgan from "morgan"
import * as Sentry from "@sentry/node"
import errorHandler from "errorhandler"

import api from "./api.js"
import config from "./config/index.js"
import followups from "./followups.js"

export default function (app: express.Application) {
  process.env.PORT = process.env.PORT || "8080"
  process.env.MES_AIDES_ROOT_URL =
    process.env.MES_AIDES_ROOT_URL || `http://localhost:${process.env.PORT}`

  // Enable Sentry in production
  // https://docs.sentry.io/development/sdk-dev/overview/#usage-for-end-users
  Sentry.init(config.sentry)

  // The request handler must be the first middleware on the app
  app.use(Sentry.Handlers.requestHandler())

  // Setup app
  const apiHandler = api()
  app.use("/api", apiHandler)
  app.use("/followups", followups)

  app.use(express.urlencoded({ extended: true, limit: "1024kb" }))

  app.set("trust proxy", true)

  // The error handler must be before any other error middleware and after all controllers
  app.use(Sentry.Handlers.errorHandler())

  if (app.get("env") == "development") {
    app.use(morgan("dev"))
    app.use(errorHandler())
  } else {
    app.use(morgan("combined"))
  }
}
