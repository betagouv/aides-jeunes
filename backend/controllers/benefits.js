var { forEach } = require("../../data/js/benefits/back")

var data = []
forEach((b, id) => {
  data.push(Object.assign({ id }, b))
})

exports.list = function (req, res) {
  res.send(data)
}
