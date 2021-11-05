const express = require("express")
const path = require("path")
const fs = require("fs")
const bodyParser = require("body-parser")

const api = express()

api.use(bodyParser.json())

const routesPath = path.join(__dirname, "../routes")
fs.readdirSync(routesPath).forEach(function (file) {
  if (/(.*)\.(js$|coffee$)/.test(file)) {
    require(routesPath + "/" + file)(api)
  }
})

api.all("*", function (req, res) {
  res.sendStatus(404)
})

module.exports = api
