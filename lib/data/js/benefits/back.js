const path = require("path")
const { get } = require("jamstack-loader")
const jamstack = get(
  path.join(__dirname, "../../../../contribuer/public/admin/config.yml")
)

const base = require(".")

module.exports = base.generate(jamstack)
