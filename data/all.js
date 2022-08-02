const path = require("path")
const { get } = require("jamstack-loader")
const jamstack = get(
  path.join(__dirname, "../contribuer/public/admin/config.yml")
)

const base = require("./index")

module.exports = base.generate(jamstack)
