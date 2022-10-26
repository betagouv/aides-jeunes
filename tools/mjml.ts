#!/usr/bin/env node

import express from "express"

import api from "../backend/api"
api()
import "../backend/lib/mongo-connector"
import Followup from "../backend/models/followup"
import renderInitial from "../backend/lib/mes-aides/emails/initial"
import "../backend/lib/mes-aides/emails/survey"

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
              .then(() => followup.renderSurveyEmail(followup))
      p.then(function (result) {
        const mode = req.query.mode || "html"
        if (mode == "html") {
          res.send(result[mode])
        } else {
          res.set({ "Content-Type": "text/plain" }).send(result[mode as string])
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
