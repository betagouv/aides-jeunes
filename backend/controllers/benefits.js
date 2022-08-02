const benefits = require("../../data/all")

exports.list = function (req, res) {
  res.send(benefits.all)
}
