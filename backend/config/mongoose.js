var path = require("path")
var fs = require("fs")

module.exports = function (mongoose, config) {
  mongoose.Promise = require("bluebird")

  mongoose.connect(config.mongo.uri, config.mongo.options)

  // Bootstrap models
  var modelsPath = path.join(__dirname, "../models")
  fs.readdirSync(modelsPath).forEach(function (file) {
    if (/(.*)\.(js$|coffee$)/.test(file)) {
      require(modelsPath + "/" + file)
    }
  })
}
