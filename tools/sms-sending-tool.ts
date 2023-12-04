import { ArgumentParser } from "argparse"
import config from "../backend/config/index.js"
import { SmsType } from "../lib/enums/messaging.js"
import mongoose from "mongoose"
import mongooseConfig from "../backend/config/mongoose.js"
import { processSendSms } from "../backend/lib/messaging/sending.js"

mongooseConfig(mongoose, config)

const parser = new ArgumentParser({
  add_help: true,
  description: "Outil d'envoi des sms de suivi",
})

const subparsers = parser.add_subparsers({
  title: "Commandes",
  dest: "command",
})

const send = subparsers.add_parser("send")
const send_types = send.add_subparsers({
  title: "Type",
  dest: "type",
})

const initial_survey_parser = send_types.add_parser(SmsType.InitialSurvey)
const simulation_results_parser = send_types.add_parser(
  SmsType.SimulationResults
)

const single_sms_id_parsers = [initial_survey_parser, simulation_results_parser]

single_sms_id_parsers.forEach((parser) => {
  parser.add_argument("--id", {
    help: "Followup Id",
  })
})

initial_survey_parser.add_argument("--multiple", {
  help: "Maximum number of sms to send",
})

async function main() {
  try {
    const args = parser.parse_args()
    const { type, id, multiple } = args

    if (args.command == "send") {
      await processSendSms(type, id, multiple)
    } else {
      parser.print_help()
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
