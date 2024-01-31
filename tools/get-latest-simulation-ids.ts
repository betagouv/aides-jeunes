import { ArgumentParser } from "argparse"
import config from "../backend/config/index.js"
import mongoose from "mongoose"
import mongooseConfig from "../backend/config/mongoose.js"
import { getLatestSimulationIds } from "../backend/lib/simulation.js"

async function main() {
  mongooseConfig(mongoose, config)
  const { limit } = createArgumentParser().parse_args()
  try {
    const simulationIds = await getLatestSimulationIds(limit)
    console.log(simulationIds.join("\n"))
  } catch (error) {
    console.error("Error:", error)
  } finally {
    await mongoose.connection.close()
    console.log("DB disconnected")
  }
}

function createArgumentParser() {
  const parser = new ArgumentParser({
    add_help: true,
    description: "Tool to get latest simulation ids (5 by default)",
  })
  parser.add_argument("--limit", {
    help: "Number of simulations ids to get (optional)",
    type: "int",
    default: 5,
  })
  return parser
}

await main()
