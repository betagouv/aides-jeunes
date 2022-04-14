const simulationController = require("./simulation")

exports.simulation = function (req, res) {
  simulationController.attachAccessCookie(req, res)
  return res.redirect(req.simulation.returnPath)
}
