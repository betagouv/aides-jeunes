import { generateSituation } from "../lib/situations.js"
import { calculate } from "../backend/lib/openfisca/index.js"
import { computeAides } from "../lib/benefits/compute.js"
import benefits from "../data/all.js"
import("../backend/lib/mongo-connector.js")
import Simulations from "../backend/models/simulation.js"
import { Situation } from "../lib/types/situations.js"

function main() {
  const simulationId = process.argv[2]
  if (!simulationId) {
    console.log("Simulation Id is missing")
    return process.exit(1)
  }

  const compute = computeAides.bind(benefits)

  Simulations.findById(simulationId, (err, simulation) => {
    if (err) return process.exit(1)

    const situation = generateSituation(simulation) as Situation

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
      process.exit()
    })
  })
}

main()
