// Connect to mongoose
import mongoose from "mongoose"
import config from "../config/index"
import mongooseConfig from "../config/mongoose"

// Setup mongoose
mongooseConfig(mongoose, config)

export default mongoose
