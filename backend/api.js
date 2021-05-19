var express = require("express")
var mongoose = require("mongoose")
var config = require("./config")

// Setup mongoose
require("./config/mongoose")(mongoose, config)

// Setup Express
var app = express()

app.use(require("./config/api"))

module.exports = app
