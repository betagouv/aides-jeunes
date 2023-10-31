import express from "express"
import * as Sentry from "@sentry/node"
import mongoose from "mongoose"

import configMongoose from "./config/mongoose.js"
import { loadRoutes } from "./routes-loader/index.js"
import config from "./config/index.js"

// Enable Sentry in production
// https://docs.sentry.io/development/sdk-dev/overview/#usage-for-end-users
Sentry.init(config.sentry)

configMongoose(mongoose, config)

export default function (app: express.Application) {
  process.env.PORT = process.env.PORT || "8080"
  process.env.MES_AIDES_ROOT_URL =
    process.env.MES_AIDES_ROOT_URL || `http://localhost:${process.env.PORT}`

  // The request handler must be the first middleware on the app
  app.use(Sentry.Handlers.requestHandler())

  loadRoutes(app)

  app.use(express.urlencoded({ extended: true, limit: "1024kb" }))
  app.set("trust proxy", true)

  // The error handler must be before any other error middleware and after all controllers
  app.use(Sentry.Handlers.errorHandler())
}
