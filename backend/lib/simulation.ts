import Simulation from "../models/simulation.js"

export async function getLatestSimulationIds(limit = 3) {
  const simulationIds = await Simulation.find({}, "_id")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean() // Faster Mongoose Queries With Lean: https://mongoosejs.com/docs/tutorials/lean.html
    .then((simulations) => simulations.map((s) => s._id.valueOf()))

  return simulationIds
}
