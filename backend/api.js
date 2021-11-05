const express = require("express")
const mongoose = require("mongoose")
const config = require("./config")

// Setup mongoose
require("./config/mongoose")(mongoose, config)

// Setup Express
const app = express()

app.use(require("./config/api"))

module.exports = app
