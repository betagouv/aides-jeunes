/* eslint-disable no-console */
var ArgumentParser = require("argparse").ArgumentParser

var es = require("event-stream")

// Loads
require("../../../backend")
require("expect")
var mongoose = require("mongoose")
var migrations = require(".")
var latestVersion = migrations.list[migrations.list.length - 1].version

// Setup mongoose
var Situation = mongoose.model("Situation")

var counter = 0
var errors = 0
var limit = 50000
var startDate = new Date().toISOString()

var parser = new ArgumentParser({
  addHelp: true,
  description: "Outil de migration des situations en base de données",
})

parser.addArgument(["--all"], {
  action: "storeTrue",
  help: `Migre toutes les situations dans la base de données, par batch de ${limit}.`,
})

parser.addArgument(["--id"], {
  help: "Migre une situation précise",
})

function migrateSituations(conditions) {
  Situation.find(conditions)
    .sort({ dateDeValeur: -1 })
    .limit(limit)
    .cursor()
    .pipe(
      es.map(function (situation, done) {
        migrations.apply(situation)
        situation.save(function (err) {
          if (err) {
            console.log("Cannot save migrated situation %s", situation.id)
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
  var args = parser.parseArgs()
  if (args.id) {
    migrateSituations({ _id: args.id })
  } else if (args.all) {
    migrateSituations({ version: { $ne: latestVersion } })
  } else {
    parser.printHelp()
    process.exit(1)
  }
}
main()
