import { ArgumentParser } from "argparse"
import config from "../config/index.js"
import { EmailType } from "../types/email.js"
import Followup from "../models/followup.js"
import mongoose from "mongoose"
import mongooseConfig from "../config/mongoose.js"
import { SurveyType } from "../../lib/types/survey.js"

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

function processSend(args) {
  const { id, type: emailType, multiple } = args

  if (id) {
    Followup.findByIdOrOldId(id)
      .then((followup) => {
        switch (emailType) {
          case EmailType.simulationResults:
            return followup.sendSimulationResultsEmail()
          case EmailType.proactiveNotification:
            return followup.sendProactiveNotificationEmail()
          case EmailType.benefitAction:
            return followup.sendSurvey(
              SurveyType.trackClickOnBenefitActionEmail
            )
          case EmailType.simulationUsefulness: {
            return followup.sendSurvey(
              SurveyType.trackClickOnSimulationUsefulnessEmail
            )
          }
          default:
            throw new Error(`Unknown email type: ${emailType}`)
        }
      })
      .then((e) => {
        console.log("log!", e)
      })
      .catch((error) => {
        console.error("error!", error, error.traceback)
      })
      .finally(() => {
        console.log("done")
        process.exit(0)
      })
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
      Followup.findOne({
        $or: [
          {
            "surveys._id": args.id,
          },
          {
            "surveys._oldId": args.id,
          },
        ],
      })
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
