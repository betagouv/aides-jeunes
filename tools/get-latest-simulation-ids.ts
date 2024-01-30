import { ArgumentParser } from "argparse"
import config from "../backend/config/index.js"
import mongoose from "mongoose"
import mongooseConfig from "../backend/config/mongoose.js"
import { getLatestSimulationIds } from "../backend/lib/simulation.js"

async function main() {
  mongooseConfig(mongoose, config)
  const { limit } = parseArguments()
  try {
    const simulations = await getLatestSimulationIds(limit)
    if (simulations.length) {
      console.log(simulations)
    }
  } catch (error) {
    console.error("Error:", error)
  } finally {
    await mongoose.connection.close()
    console.log("DB disconnected")
  }
}

function parseArguments() {
  const args = createArgumentParser().parse_args()
  return { limit: args.limit ? parseInt(args.limit) : undefined }
}

function createArgumentParser() {
  const parser = new ArgumentParser({
    add_help: true,
    description: "Tool to get latest simulation ids (5 by default)",
  })
  parser.add_argument("--limit", {
    help: "Number of simulations ids to get (optional)",
  })
  return parser
}

await main()
