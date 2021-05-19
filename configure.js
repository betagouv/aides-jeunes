#!/usr/bin/env node

var bodyParser = require("body-parser")
var morgan = require("morgan")
var utils = require("./backend/lib/utils")
var Sentry = require("@sentry/node")

module.exports = function (app) {
  Sentry.init({
    // Enable Sentry in production
    // https://docs.sentry.io/development/sdk-dev/overview/#usage-for-end-users
    dsn:
      process.env.NODE_ENV === "production"
        ? "https://dff4dd1245ed4ed2b05a11f513c23cb4@o548798.ingest.sentry.io/5709109"
        : null,
  })

  // The request handler must be the first middleware on the app
  app.use(Sentry.Handlers.requestHandler())

  // Setup app
  app.use("/api", require("./backend/api"))

  app.use("/followups", require("./backend/followups"))

  app.use(bodyParser.urlencoded({ limit: "1024kb" }))

  // Route to download a PDF
  let puppeteerArgs = {}
  if (process.env.PUPPETEER_ARGS) {
    try {
      puppeteerArgs = JSON.parse(process.env.PUPPETEER_ARGS)
    } catch (e) {
      // Do nothing
    }
  }

  app.set("trust proxy", true)

  app.route("/foyer/resultat").post(function (req, res) {
    var html = Buffer.from(req.body.base64, "base64").toString("utf-8")

    var pdfOptions = {
      format: "A4",
      margin: {
        top: "0.5cm",
        right: "2cm",
        bottom: "0.5cm",
        left: "2cm",
      },
    }

    var callback = function (pdf) {
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
  app.use(Sentry.Handlers.errorHandler())

  if (app.get("env") == "development") {
    app.use(morgan("dev"))
    app.use(require("errorhandler")())
  } else {
    app.use(morgan("combined"))
  }
}
