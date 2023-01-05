import path from "path"
import fs from "fs"
import bluebird from "bluebird"
import { ConfigurationLayout } from "../types/config.js"

const __dirname = new URL(".", import.meta.url).pathname

export default function (mongoose: any, config: ConfigurationLayout) {
  mongoose.Promise = bluebird

  mongoose
    .connect(config.mongo.uri, config.mongo.options)
    .then(() => console.info("DB connected"))
    .catch((e) => {
      throw new Error(e)
    })

  // Bootstrap models
  const modelsPath = path.join(__dirname, "../models")
  fs.readdirSync(modelsPath).forEach(async (file) => {
    if (/(.*)\.(js$|coffee$)/.test(file)) {
      await import(`${modelsPath}/${file}`)
    }
  })
}
