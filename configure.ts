#!/usr/bin/env node

import express from "express"
import morgan from "morgan"
import Sentry from "@sentry/node"
import errorHandler from "errorhandler"

import api from "./backend/api.js"

export default function (devServer) {
  Sentry.init({
    // Enable Sentry in production
    // https://docs.sentry.io/development/sdk-dev/overview/#usage-for-end-users
    dsn:
      process.env.NODE_ENV === "production"
        ? "https://b44fa037e37b4b9eb1a050675b253dce@sentry.incubateur.net/17"
        : undefined,
  })

  // The request handler must be the first middleware on the app
  devServer.app.use(Sentry.Handlers.requestHandler())

  // Setup app
  devServer.app.use("/api", api)

  //devServer.app.use("/followups", require("./backend/followups"))

  devServer.app.use(express.urlencoded({ extended: true, limit: "1024kb" }))

  devServer.app.set("trust proxy", true)

  // The error handler must be before any other error middleware and after all controllers
  devServer.app.use(Sentry.Handlers.errorHandler())

  if (devServer.app.get("env") == "development") {
    devServer.app.use(morgan("dev"))
    devServer.app.use(errorHandler())
  } else {
    devServer.app.use(morgan("combined"))
  }
}
