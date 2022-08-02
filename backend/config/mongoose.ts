import path from "path"
import fs from "fs"
import bluebird from "bluebird"
const __dirname = new URL(".", import.meta.url).pathname

export default function (mongoose, config) {
  mongoose.Promise = bluebird

  mongoose.connect(config.mongo.uri, config.mongo.options)

  // Bootstrap models
  const modelsPath = path.join(__dirname, "../models")
  fs.readdirSync(modelsPath).forEach(async (file) => {
    if (/(.*)\.(js$|coffee$)/.test(file)) {
      await import(`${modelsPath}/${file}`)
    }
  })
}
