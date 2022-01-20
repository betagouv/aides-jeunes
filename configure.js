#!/usr/bin/env node

const bodyParser = require("body-parser")
const morgan = require("morgan")
const utils = require("./backend/lib/utils")
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

  // Route to download a PDF
  let puppeteerArgs = {}
  if (process.env.PUPPETEER_ARGS) {
    try {
      puppeteerArgs = JSON.parse(process.env.PUPPETEER_ARGS)
    } catch (e) {
      // Do nothing
    }
  }

  devServer.app.set("trust proxy", true)

  devServer.app.route("/foyer/resultat").post(function (req, res) {
    const html = Buffer.from(req.body.base64, "base64").toString("utf-8")

    const pdfOptions = {
      format: "A4",
      margin: {
        top: "0.5cm",
        right: "2cm",
        bottom: "0.5cm",
        left: "2cm",
      },
    }

    const callback = function (pdf) {
      res.writeHead(200, {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          "attachment; filename=MesAides_simulation_" +
          req.body.basename +
          ".pdf",
      })
      res.end(pdf, "binary")
    }

    utils.convertHTMLToPDF(html, callback, pdfOptions, puppeteerArgs, false)
  })

  // The error handler must be before any other error middleware and after all controllers
  devServer.app.use(Sentry.Handlers.errorHandler())

  if (devServer.app.get("env") == "development") {
    devServer.app.use(morgan("dev"))
    devServer.app.use(require("errorhandler")())
  } else {
    devServer.app.use(morgan("combined"))
  }
}
