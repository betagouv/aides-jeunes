#!/usr/bin/env node

const bodyParser = require("body-parser")
const morgan = require("morgan")
const Sentry = require("@sentry/node")

module.exports = function (devServer) {
  if (process.env.ENABLE_SENTRY === "true") {
    Sentry.init({
      // Enable Sentry in production
      // https://docs.sentry.io/development/sdk-dev/overview/#usage-for-end-users
      dsn:
        process.env.NODE_ENV === "production"
          ? "https://b44fa037e37b4b9eb1a050675b253dce@sentry.incubateur.net/17"
          : null,
    })

    // The request handler must be the first middleware on the app
    devServer.app.use(Sentry.Handlers.requestHandler())

    console.log("Sentry enabled")
  } else {
    console.log("Sentry disabled")
  }

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
