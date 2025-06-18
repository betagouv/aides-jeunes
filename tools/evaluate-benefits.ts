import { generateSituation } from "../lib/situations.js"
import { calculate } from "../backend/lib/openfisca"
import { computeAides } from "../lib/benefits/compute.js"
import benefits from "../data/all.js"
import("../backend/lib/mongo-connector.js")
import Simulations from "../backend/models/simulation.js"
import { Situation } from "../lib/types/situations.js"

async function main() {
  const simulationId = process.argv[2]
  if (!simulationId) {
    console.log("Simulation Id is missing")
    return process.exit(1)
  }

  const compute = computeAides.bind(benefits)

  try {
    const simulation = await Simulations.findById(simulationId)
    if (!simulation) {
      return process.exit(1)
    }
    const simulationIdResult = simulation._id
    if (!simulationIdResult) {
      return process.exit(1)
    }

    const situation = generateSituation(simulation) as Situation

    calculate(situation, function (err, result) {
      const openfiscaResponse = Object.assign(
        { _id: simulationIdResult },
        result,
      )

      const simulationResult = compute(
        situation,
        simulationIdResult.toString(),
        openfiscaResponse,
        false,
      )
      console.log(simulationResult)
      process.exit()
    })
  } catch (error) {
    console.error("Error:", error)
    process.exit(1)
  }
}

main()
