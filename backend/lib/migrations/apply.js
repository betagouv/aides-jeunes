/* eslint-disable no-console */
import argparse from "argparse"
const ArgumentParser = argparse.ArgumentParser

import es from "event-stream"

// Loads
import except from "except"
import mongoose from "../mongo-connector.js"
import { apply, getLatestVersionByFolderName } from "./index.js"

// Setup mongoose
const modelMigration = {
  simulations: {
    model: mongoose.model("Simulation"),
  },
  followups: {
    model: mongoose.model("Followup"),
  },
}

Object.keys(modelMigration).forEach((key) => {
  modelMigration[key].latestVersion = getLatestVersionByFolderName(key)
})

let counter = 0
let errors = 0
const limit = 50000
const startDate = new Date().toISOString()

const parser = new ArgumentParser({
  addHelp: true,
  description: "Outil de migration des situations en base de données",
})

parser.addArgument(["--all"], {
  action: "storeTrue",
  help: `Migre toutes les simulations dans la base de données, par batch de ${limit}.`,
})

parser.addArgument(["--id"], {
  help: "Migre une simulation précise",
})

parser.addArgument(["--model"], {
  help: "Migre une simulation précise",
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
  const args = parser.parseArgs()
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
