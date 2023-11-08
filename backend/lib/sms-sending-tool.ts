import { ArgumentParser } from "argparse"
import config from "../config/index.js"
import { SmsCategory } from "../../lib/enums/sms.js"
import mongoose from "mongoose"
import mongooseConfig from "../config/mongoose.js"
import { processSendSms } from "./sms/sending.js"

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

// Single emails types parsers
const singleEmailTypes = [
  SmsCategory.SimulationResults,
  SmsCategory.InitialSurvey,
]
singleEmailTypes.forEach((emailType) => {
  const parser = send_types.add_parser(emailType)
  parser.add_argument("--id", {
    help: "Followup Id",
  })
})

// Multiple sms types parsers
const multipleSmsTypes = [SmsCategory.InitialSurvey]
multipleSmsTypes.forEach((emailType) => {
  const parser = send_types.add_parser(emailType)
  parser.add_argument("--multiple", {
    help: "Number of sms to send",
  })
})

async function main() {
  try {
    const args = parser.parse_args()
    const multiple = args.multiple ? parseInt(args.multiple) : null

    switch (args.command) {
      case "send":
        await processSendSms(args.type, args.id, multiple)

        console.log("Done")
        break
      default:
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
