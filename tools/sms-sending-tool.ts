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

// Parser builder : single sms option by id for all sms types
const smsCategories = [SmsType.InitialSurvey, SmsType.SimulationResults]
smsCategories.forEach((smsType) => {
  const single_sms_id_parser = send_types.add_parser(smsType)
  single_sms_id_parser.add_argument("--id", {
    help: "Followup Id",
  })
})

// Parser builder : multiple sms option for InitialSurvey sms only
const multiple_sms_parser = send_types.add_parser(SmsType.InitialSurvey)
multiple_sms_parser.add_argument("--multiple", {
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
