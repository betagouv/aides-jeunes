/* eslint-disable no-console */
const ArgumentParser = require("argparse").ArgumentParser

const es = require("event-stream")

// Loads
require("../../../backend")
require("expect")
const mongoose = require("mongoose")
const migrations = require(".")
const latestVersion = migrations.list[migrations.list.length - 1].version

// Setup mongoose
const Simulation = mongoose.model("Simulation")

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

function migrateSimulations(conditions) {
  Simulation.find(conditions)
    .sort({ dateDeValeur: -1 })
    .limit(limit)
    .cursor()
    .pipe(
      es.map(function (simulation, done) {
        migrations.apply(simulation)
        simulation.save(function (err) {
          if (err) {
            console.log("Cannot save migrated simulation %s", simulation.id)
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
          latestVersion,
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
  if (args.id) {
    migrateSimulations({ _id: args.id })
  } else if (args.all) {
    migrateSimulations({ version: { $ne: latestVersion } })
  } else {
    parser.printHelp()
    process.exit(1)
  }
}
main()
