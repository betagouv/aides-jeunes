import { ArgumentParser } from "argparse"
import config from "../config/index.js"
import { EmailType } from "../enums/email.js"
import Followup, { FollowupInterface } from "../models/followup.js"
import mongoose from "mongoose"
import mongooseConfig from "../config/mongoose.js"
import { SurveyType } from "../../lib/enums/survey.js"

mongooseConfig(mongoose, config)

const parser = new ArgumentParser({
  add_help: true,
  description: "Outil d'envoi des emails de suivi",
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

const send_simulation_results = send_types.add_parser(
  EmailType.simulationResults
)
const send_benefit_action = send_types.add_parser(EmailType.benefitAction)
const send_simulation_usefulness = send_types.add_parser(
  EmailType.simulationUsefulness
)
const send_initial_survey = send_types.add_parser("initial-survey")
const senders = [
  send_simulation_results,
  send_benefit_action,
  send_simulation_usefulness,
]
senders.forEach((send) => {
  send.add_argument("--id", {
    help: "Followup Id",
  })
})

send_initial_survey.add_argument("--multiple", {
  help: "Number of emails to send",
})

async function processSendEmails(emailType, followupId, multiple) {
  if (followupId) {
    await processSingleEmail(emailType, followupId)
  } else if (multiple) {
    if (emailType !== "initial-survey") {
      throw new Error("Multiple emails can only be sent for initial survey")
    }
    const limit = parseInt(multiple) || 1
    Followup.find({
      surveys: { $size: 0 },
      sentAt: {
        $lt: new Date(new Date().getTime() - 6.5 * 24 * 60 * 60 * 1000),
      },
      surveyOptin: true,
    })
      .sort({ createdAt: 1 })
      .limit(limit)
      .then((list) => {
        return Promise.all(
          list.map(function (followup) {
            const surveyType =
              Math.random() > 0.5
                ? SurveyType.trackClickOnBenefitActionEmail
                : SurveyType.trackClickOnSimulationUsefulnessEmail
            return followup
              .sendSurvey(surveyType)
              .then(function (result) {
                return { ok: result._id }
              })
              .catch(function (error) {
                return { ko: error }
              })
          })
        )
      })
      .then((list) => {
        console.log(list)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        console.log("done")
        process.exit(0)
      })
  } else {
    parser.printHelp()
    process.exit(1)
  }
}

async function processSingleEmail(emailType, followupId) {
  const followup: FollowupInterface | null = await Followup.findById(followupId)
  if (!followup) {
    throw new Error("Followup not found")
  }

  let emailPromise: Promise<void>

  switch (emailType) {
    case EmailType.simulationResults:
      emailPromise = followup.sendSimulationResultsEmail()
      break
    case EmailType.benefitAction:
      emailPromise = followup.sendSurvey(
        SurveyType.trackClickOnBenefitActionEmail
      )
      break
    case EmailType.simulationUsefulness:
      emailPromise = followup.sendSurvey(
        SurveyType.trackClickOnSimulationUsefulnessEmail
      )
      break
    default:
      throw new Error(`Unknown email type: ${emailType}`)
  }

  const email = await emailPromise
  console.log("Email sent", email)
}

async function main() {
  try {
    const args = parser.parse_args()
    const multiple = args.multiple ? parseInt(args.multiple) : null

    switch (args.command) {
      case "send":
        await processSendEmails(args.type, args.id, multiple)

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
