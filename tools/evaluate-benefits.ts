import { generateSituation } from "../lib/situations.js"
import { calculate } from "../backend/lib/openfisca/index.js"
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
      console.log("Simulation not found")
      return process.exit(1)
    }

    const situation = generateSituation(simulation) as Situation

    const result = await new Promise((resolve, reject) => {
      calculate(situation, function (err, result) {
        if (err) reject(err)
        else resolve(result)
      })
    })

    const openfiscaResponse = Object.assign(
      { _id: simulation?._id?.toString() },
      result
    )

    const simulationResult = compute(
      situation,
      simulation._id as string,
      openfiscaResponse,
      false
    )
    console.log(simulationResult)
    process.exit()
  } catch (error) {
    console.error("Error:", error)
    process.exit(1)
  }
}

main()
