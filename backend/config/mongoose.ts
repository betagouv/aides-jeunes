import path from "path"
import fs from "fs"
import bluebird from "bluebird"

export default function (mongoose, config) {
  mongoose.Promise = bluebird

  mongoose.connect(config.mongo.uri, config.mongo.options)

  // Bootstrap models
  const modelsPath = path.join(path.dirname(""), "backend/models")
  fs.readdirSync(modelsPath).forEach(async (file) => {
    if (/(.*)\.(js$|coffee$)/.test(file)) {
      await import(`../../${modelsPath}/${file}`)
    }
  })
}
