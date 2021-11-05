const ArgumentParser = require("argparse").ArgumentParser

const config = require("../config")
const mongoose = require("mongoose")
require("../config/mongoose")(mongoose, config)

const Followup = mongoose.model("Followup")

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

const send_initial = send_types.add_parser("initial")
const send_survey = send_types.add_parser("survey")
const senders = [send_initial, send_survey]
senders.forEach((send) => {
  send.add_argument("--id", {
    help: "Followup Id",
  })
  send.add_argument("--mock", {
    action: "store_true",
    help: "Do not send emails",
  })

  send.add_argument("--multiple", {
    help: "Number of emails to send",
  })
  send.add_argument("--all", {
    action: "store_true",
    help: "Send multiple emails",
  })
})

const reply = subparsers.add_parser("reply")
reply.add_argument("--id", {
  help: "Survey Id",
})

function processSend(args) {
  if (args.id) {
    Followup.findOne({
      _id: args.id,
    })
      .then((f) => {
        switch (args.type) {
          case "initial":
            return f.sendInitialEmail()
          case "survey":
            if (args.mock) {
              return f.mock()
            } else {
              return f.sendSurvey()
            }
          default:
            return
        }
      })
      .then((e) => {
        console.log("log!", e)
      })
      .catch((e) => {
        console.error("error!", e.traceback)
      })
      .finally(() => {
        console.log("done")
        process.exit(0)
      })
  } else if (args.multiple) {
    if (args.type !== "survey") {
      process.exit(0)
    }
    const limit = parseInt(args.multiple) || 1
    Followup.find({
      "surveys.type": { $ne: "initial" },
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
            return followup
              .sendSurvey()
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
        "surveys._id": args.id,
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
