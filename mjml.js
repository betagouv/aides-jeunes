#!/usr/bin/env node
/* eslint-disable no-console */

const express = require("express")

require("./backend/api")
const Followup = require("mongoose").model("Followup")
const renderInitial = require("./backend/lib/mes-aides/emails/initial").render
// eslint-disable-next-line no-unused-vars
const renderSurvey = require("./backend/lib/mes-aides/emails/survey").render

const port = process.env.PORT || 9001

// Setup Express
const app = express()

const typeKeys = ["initial", "survey"]

app.route("/").get(function (req, res) {
  Followup.find()
    .sort({ createdAt: -1 })
    .exec(function (err, docs) {
      res.send(`
      <html><body><h1>List</h1><ul>
      ${docs.map(
        (d) => `
        <li>
          ${d._id}&nbsp;
          <ul>
            ${typeKeys
              .map(
                (t) =>
                  `<li>${t} <a href="mjml/${d._id}/${t}?mode=html">HTML</a> <a href="mjml/${d._id}/${t}?mode=text">texte</a></li>`
              )
              .join("")}
          </ul>
        </li>
        `
      )}</ul></body></html>
`)
    })
})

app.route("/mjml/:id/:type").get(function (req, res) {
  Followup.findOne({ _id: req.params.id })
    .populate("answers")
    .exec(function (err, followup) {
      console.log("followup", { _id: req.params.id }, followup)

      const p =
        req.params.type == "initial"
          ? renderInitial(followup)
          : followup.createSurvey().then((s) => followup.renderSurveyEmail(s))
      p.then(function (result) {
        const mode = req.query.mode || "html"
        if (mode == "html") {
          res.send(result[mode])
        } else {
          res.set({ "Content-Type": "text/plain" }).send(result[mode])
        }
      })
    })
})

// Start server
app.listen(port, function () {
  console.log(
    "Mes Aides MJML preview server listening on port %d, in %s mode",
    port,
    app.get("env")
  )
})

module.exports = app
