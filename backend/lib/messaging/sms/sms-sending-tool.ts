import { ArgumentParser } from "argparse"
import config from "../../../config/index.js"
import { SmsCategory } from "../../../../lib/enums/sms.js"
import mongoose from "mongoose"
import mongooseConfig from "../../../config/mongoose.js"
import { processSendSms } from "../../sms/sending.js"

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

// Arguments builder
const smsCategories = [SmsCategory.InitialSurvey, SmsCategory.SimulationResults]
smsCategories.forEach((smsCategory) => {
  const parser = send_types.add_parser(smsCategory)
  parser.add_argument("--multiple", {
    help: "Number of sms to send",
  })
  parser.add_argument("--id", {
    help: "Followup Id",
  })
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
