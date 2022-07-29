import express from "express"
import mongoose from "mongoose"
import config from "./config/index.js"
import configMongoose from "./config/mongoose.js"
import configAPI from "./config/api.js"

// Setup mongoose
configMongoose(mongoose, config)

// Setup Express
const app = express()
app.use(configAPI)

export default app
