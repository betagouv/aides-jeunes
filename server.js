#!/usr/bin/env node
/* eslint-disable no-console */

var express = require("express")
var app = express()
var path = require("path")

var port = process.env.PORT || 8080

process.env.MES_AIDES_ROOT_URL =
  process.env.MES_AIDES_ROOT_URL || "http://localhost:" + port
require("./configure")(app)

app.use(express.static("dist"))
app.route("/*").get(function (req, res) {
  res.sendFile(path.join(__dirname, "dist/index.html"))
})

app.use(function (err, req, res, next) {
  console.error(err)
  res.status(parseInt(err.code) || 500).send(err)
  next()
})

app.listen(port, function () {
  console.log(
    "Mes Aides server listening on port %d, in %s mode, expecting to be deployed on %s",
    port,
    app.get("env"),
    process.env.MES_AIDES_ROOT_URL
  )
})

module.exports = app
