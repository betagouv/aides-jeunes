const { generateSituation } = require("../lib/situations")
const { calculate } = require("../backend/lib/openfisca")
const { computeAides } = require("../lib/benefits/compute")
const benefits = require("../data/all")

// Connect to mongoose
const mongoose = require("mongoose")
const config = require("../backend/config")
// Setup mongoose
require("../backend/config/mongoose")(mongoose, config)
const Simulation = mongoose.model("Simulation")

const simulationId = process.argv[2]
if (!simulationId) {
  console.log("Simulation Id is missing")
  return process.exit(1)
}

const compute = computeAides.bind(benefits)

Simulation.findById(simulationId, (err, simulation) => {
  if (err) return process.exit(1)

  const situation = generateSituation(simulation)

  calculate(situation, function (err, result) {
    const openfiscaResponse = Object.assign(
      { _id: simulation._id.toString() },
      result
    )

    const simulationResult = compute(
      situation,
      simulation._id,
      openfiscaResponse,
      false
    )
    console.log(simulationResult)
  })
})
