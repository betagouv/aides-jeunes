// Connect to mongoose
const mongoose = require("mongoose")
const config = require("../config")
// Setup mongoose
require("../config/mongoose")(mongoose, config)

module.exports = mongoose
