#!/usr/bin/env node
/* eslint-disable no-console */

const express = require("express")
const path = require("path")

const app = express()
const port = process.env.PORT || 8080

process.env.MES_AIDES_ROOT_URL =
  process.env.MES_AIDES_ROOT_URL || `http://localhost:${port}`
require("./configure")({ app })

app.use(express.static("dist"))
app.route("/*").get(function (req, res) {
  res.sendFile("~/dist/index.html")
})

app.use(function (err, req, res, next) {
  console.error(err)
  res.status(parseInt(err.code) || 500).send(err)
  next()
})

app.listen(port, () => {
  console.log(
    `Aides Jeunes server listening on port ${port}, in ${app.get(
      "env"
    )} mode, expecting to be deployed on ${process.env.MES_AIDES_ROOT_URL}`
  )
})

module.exports = app
