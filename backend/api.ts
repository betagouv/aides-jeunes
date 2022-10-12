import express from "express"
import mongoose from "mongoose"
import config from "./config/index"
import configMongoose from "./config/mongoose"
import configAPI from "./config/api"

function apiHandler() {
  // Setup mongoose
  configMongoose(mongoose, config)

  // Setup Express
  const app = express()
  app.use(configAPI)

  return app
}

export default apiHandler
