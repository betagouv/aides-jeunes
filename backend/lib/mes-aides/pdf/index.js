const mjml = require("mjml")
const path = require("path")

exports.imageRoot = path.join(__dirname, "../../../../public/img/")

exports.mjml = function (template) {
  return mjml(template, {
    fonts: {},
  })
}
