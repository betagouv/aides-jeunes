const { forEach } = require("../../data/all")

const data = []
forEach((b, id) => {
  data.push(Object.assign({ id }, b))
})

exports.list = function (req, res) {
  res.send(data)
}
