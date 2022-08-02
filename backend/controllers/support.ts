import simulationController from "./simulation.js"

export default function simulation(req, res) {
  simulationController.attachAccessCookie(req, res)
  return res.redirect(req.simulation.returnPath)
}
