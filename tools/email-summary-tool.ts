import { ArgumentParser } from "argparse"
import config from "../backend/config/index.js"
import mongoose from "mongoose"
import mongooseConfig from "../backend/config/mongoose.js"
import { FollowupFactory } from "../backend/lib/followup-factory.js"
import Simulations from "../backend/models/simulation.js"
import { Simulation } from "../lib/types/simulation.js"
import { sendSimulationResultsEmail } from "../backend/lib/messaging/email/email-service.js"

mongooseConfig(mongoose, config)

const parser = new ArgumentParser({
  add_help: true,
  description: "Outil d'envoi des emails de suivi",
})

parser.add_argument("--id", {
  help: "Simulation Id",
  required: true,
})

parser.add_argument("--email", {
  help: "Email address to send to",
  required: true,
})

async function main() {
  try {
    const args = parser.parse_args()
    const { id, email } = args
    if (!id || !email) {
      parser.print_help()
      return
    }
    const simulation = (await Simulations.findById(id)) as Simulation
    if (simulation) {
      const followup = await FollowupFactory.create(simulation, true, email)
      console.log("Followup created")
      console.log(followup._id.toString())
      if (followup) {
        const { messageId } = await sendSimulationResultsEmail(followup)
        if (messageId) {
          console.log("Email sent")
          console.log("messageId ", messageId)
        } else {
          throw new Error("Email not sent")
        }
      } else {
        throw new Error("Followup not created")
      }
    } else {
      throw new Error(`Simulation ${id} not found`)
    }
  } catch (error) {
    console.error("Error:", error)
    parser.print_help()
  } finally {
    await mongoose.connection.close()
    console.log("DB disconnected")
  }
}

await main()
