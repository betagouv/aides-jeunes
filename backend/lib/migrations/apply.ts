import argparse from "argparse"

const ArgumentParser = argparse.ArgumentParser

import es from "event-stream"

// Loads
import { apply, getLatestVersionByModelName } from "./index.js"
import "../mongo-connector.js"
import Simulations from "../../models/simulation.js"
import Followups from "../../models/followup.js"

let counter = 0
let errors = 0
const limit = 50000
const startDate = new Date().toISOString()

const parser = new ArgumentParser({
  add_help: true,
  description: "Outil de migration des situations en base de données",
})

parser.add_argument("--all", {
  action: "store_true",
  help: `Migre toutes les simulations dans la base de données, par batch de ${limit}.`,
})

parser.add_argument("--id", {
  help: "Migre une simulation précise",
})

parser.add_argument("--model", {
  help: "Migre une simulation précise",
})

const modelMigration = {
  simulations: {
    model: Simulations,
  },
  followups: {
    model: Followups,
  },
}
Object.keys(modelMigration).forEach((key) => {
  modelMigration[key].latestVersion = getLatestVersionByModelName(key)
})

function migrate(currentMigration, conditions) {
  console.log("conditions", conditions)

  currentMigration.model
    .find(conditions)
    .sort({ _id: -1 })
    .limit(limit)
    .cursor()
    .pipe(
      es.map(function (model, done) {
        apply(model)
        model.save(function (err) {
          if (err) {
            console.log(
              `Cannot save migrated ${model.constructor.modelName} ${model.id}`
            )
            console.trace(err)
            errors = errors + 1
          }
          counter = counter + 1
          done()
        })
      })
    )
    .on("end", function () {
      console.log(
        [
          "Terminé",
          currentMigration.latestVersion,
          startDate,
          new Date().toISOString(),
          counter,
          errors,
        ].join(";")
      )
      process.exit()
    })
    .on("error", function (err) {
      console.trace(err)
      process.exit()
    })
    .resume()
}

function main() {
  const args = parser.parse_args()
  const currentMigration = args.model
    ? modelMigration[args.model]
    : modelMigration.simulations
  if (args.id) {
    migrate(currentMigration, { _id: args.id })
  } else if (args.all) {
    migrate(currentMigration, {
      version: { $ne: currentMigration.latestVersion },
    })
  } else {
    parser.printHelp()
    process.exit(1)
  }
}

main()
