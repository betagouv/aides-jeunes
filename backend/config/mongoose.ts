import path from "path"
import fs from "fs"
import bluebird from "bluebird"
import { ConfigurationLayout } from "../types/config.js"

export default function (mongoose: any, config: ConfigurationLayout) {
  mongoose.Promise = bluebird

  if (!config.mongo.uri) {
    throw new Error("Please provide a `MONGODB_URL` environment variable")
  }

  mongoose
    .connect(config.mongo.uri, config.mongo.options)
    .then(() => console.info("DB connected"))
    .catch((e) => {
      throw new Error(e)
    })

  // Bootstrap models
  const __dirname = new URL(".", import.meta.url).pathname
  const modelsPath = path.join(__dirname, "../models")
  fs.readdirSync(modelsPath).forEach(async (file) => {
    if (/(.*)\.(js$|coffee$)/.test(file)) {
      await import(`${modelsPath}/${file}`)
    }
  })
}
