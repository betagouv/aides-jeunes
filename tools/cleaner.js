/* eslint-disable no-console */
const es = require("event-stream")

// Loads
require("expect")
const mongoose = require("../backend/lib/mongo-connector")
const Simulation = mongoose.model("Simulation")

function getAnonymizedAnswer(answer) {
  switch (answer.entityName) {
    case "famille": {
      switch (answer.fieldName) {
        case "en_couple": {
          return answer
        }
        default: {
          return null
        }
      }
      return answer
    }
    case "menage": {
      switch (answer.fieldName) {
        case "depcom":
        case "loyer":
        case "statut_occupation_logement": {
          return answer
        }
        default: {
          return null
        }
      }
      return answer
    }
    case "individu": {
      if (answer.id == "demandeur" || answer.id == "conjoint") {
        switch (answer.fieldName) {
          case "_contrat_alternant":
          case "_hasRessources":
          case "_interetAidesSanitaireSocial":
          case "_interetBafa":
          case "_interetEtudesEtranger":
          case "_interetPermisDeConduire":
          case "_interetsAidesVelo":
          case "activite":
          case "alternant":
          case "boursier":
          case "depcom":
          case "enfant_a_charge":
          case "nationalite":
          case "ressources": {
            return answer
          }
          case "date_naissance": {
            return {
              id: answer.id,
              entityName: answer.entityName,
              fieldName: "age",
              value: 42 /* TODO */,
            }
          }
          default: {
            return null
          }
        }
        return answer
      } else {
        return null
      }
    }
    default: {
      return null
    }
  }
}

function generateNewAll(answers) {
  return answers.map(getAnonymizedAnswer).filter((a) => a)
}

function main() {
  Simulation.find()
    .sort({ _id: -1 })
    .cursor()
    .pipe(
      es.map(function (model, done) {
        console.log(model._id.valueOf())
        model.status = "anonymized"

        const newAll = generateNewAll(model.answers.all)

        model.answers = {
          all: newAll,
          current: [],
        }
        console.log(newAll)
        /*model.save(function (err) {
          if (err) {
            console.log(
              `Cannot save ${model.constructor.modelName} ${model.id}`
            )
            console.trace(err)
          }
          done()
        })*/

        done()
      })
    )
    .on("end", function () {
      console.log(["Terminé"].join(";"))
      process.exit()
    })
    .on("error", function (err) {
      console.trace(err)
      process.exit()
    })
    .resume()
}

main()
