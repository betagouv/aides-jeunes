#!/usr/bin/env node
/* eslint-disable no-console */

import express from "express"

import "../backend/api.js"
import mongoose from "mongoose"
//const Followup = mongoose.model("Followup")
import Followup from "../backend/models/followup.js"
import renderInitial from "../backend/lib/mes-aides/emails/initial.js"
// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
import "../backend/lib/mes-aides/emails/survey.js"

const port = process.env.PORT || 9001

// Setup Express
const app = express()

const typeKeys = ["initial", "survey"]

app.route("/").get(function (req, res) {
  Followup.find()
    .sort({ createdAt: -1 })
    .limit(10)
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
  Followup.findByIdOrOldId(req.params.id)
    .populate("simulation")
    .exec(function (err, followup) {
      const p =
        req.params.type == "initial"
          ? renderInitial(followup)
          : followup
              .createSurvey()
              .then((s) => followup.renderSurveyEmail(followup))
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
    `Mes Aides MJML preview server listening on port ${port}, in ${app.get(
      "env"
    )} mode, http://localhost:${port}`
  )
})

export default app
