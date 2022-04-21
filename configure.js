#!/usr/bin/env node

const bodyParser = require("body-parser")
const morgan = require("morgan")
const Sentry = require("@sentry/node")

module.exports = function (devServer) {
  Sentry.init({
    // Enable Sentry in production
    // https://docs.sentry.io/development/sdk-dev/overview/#usage-for-end-users
    dsn:
      process.env.NODE_ENV === "production"
        ? "https://dff4dd1245ed4ed2b05a11f513c23cb4@o548798.ingest.sentry.io/5709109"
        : null,
  })

  // The request handler must be the first middleware on the app
  devServer.app.use(Sentry.Handlers.requestHandler())

  // Setup app
  devServer.app.use("/api", require("./backend/api"))

  devServer.app.use("/followups", require("./backend/followups"))

  devServer.app.use(bodyParser.urlencoded({ extended: true, limit: "1024kb" }))

  devServer.app.set("trust proxy", true)

  // The error handler must be before any other error middleware and after all controllers
  devServer.app.use(Sentry.Handlers.errorHandler())

  if (devServer.app.get("env") == "development") {
    devServer.app.use(morgan("dev"))
    devServer.app.use(require("errorhandler")())
  } else {
    devServer.app.use(morgan("combined"))
  }
}
