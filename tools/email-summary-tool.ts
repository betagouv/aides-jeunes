import { ArgumentParser } from "argparse"
import config from "../backend/config/index.js"
import mongoose from "mongoose"
import mongooseConfig from "../backend/config/mongoose.js"
import { FollowupFactory } from "../backend/lib/followup-factory.js"
import Simulations from "../backend/models/simulation.js"
import { Simulation } from "../lib/types/simulation.js"
import { sendSimulationResultsEmail } from "../backend/lib/messaging/email/email-service.js"

async function main() {
  const parser = createArgumentParser()
  try {
    const { id, email } = parser.parse_args()

    mongooseConfig(mongoose, config)
    const simulation: Simulation | null = await Simulations.findById(id)
    if (!simulation) {
      throw new Error(`Simulation ${id} not found`)
    }

    const followup = await FollowupFactory.createWithResults(
      simulation,
      true,
      email
    )
    if (!followup) {
      throw new Error("Followup not created")
    }

    console.log("Followup created")
    console.log(followup._id)

    const { messageId } = await sendSimulationResultsEmail(followup)
    if (!messageId) {
      throw new Error("Email not sent")
    }
    console.log("Email sent")
    console.log("messageId ", messageId)
  } catch (error) {
    console.error("Error:", error)
    parser.print_help()
  } finally {
    await mongoose.connection.close()
    console.log("DB disconnected")
  }
}

function createArgumentParser() {
  const parser = new ArgumentParser({
    add_help: true,
    description: "Summary email sending tool",
  })
  parser.add_argument("--id", {
    help: "Simulation Id",
    required: true,
  })
  parser.add_argument("--email", {
    help: "Email address to send to",
    required: true,
  })
  return parser
}

await main()
