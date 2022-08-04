// Connect to mongoose
import mongoose from "mongoose"
import config from "../config/index.js"
import mongooseConfig from "../config/mongoose.js"

// Setup mongoose
mongooseConfig(mongoose, config)

export default mongoose
