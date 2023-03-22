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

const reply = subparsers.add_parser("reply")
reply.add_argument("--id", {
  help: "Survey Id",
})

async function processSend(args) {
  const { id, type: emailType, multiple } = args
  if (id) {
    try {
      const followup: FollowupInterface | null = await Followup.findById(id)
      if (!followup) {
        throw new Error("Followup not found")
      }
      console.log(typeof followup)

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
    } catch (error) {
      console.error("Error:", error)
    } finally {
      console.log("Done")
      process.exit(0)
    }
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

function main() {
  const args = parser.parse_args()
  switch (args.command) {
    case "send":
      processSend(args)
      break
    case "reply":
      Followup.findOne({ "surveys._id": args.id })
        .then((e) => {
          console.log(e)
        })
        .catch((e) => {
          console.error(e)
        })
        .finally(() => {
          process.exit(0)
        })
      break
    default:
      parser.printHelp()
      process.exit(1)
  }
}

main()
