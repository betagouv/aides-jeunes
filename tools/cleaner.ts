/* eslint-disable no-console */
import es from "event-stream"

// Loads
// import expect from "expect"
import("../backend/lib/mongo-connector")
import Simulation from "../backend/models/simulation"
import Followup from "../backend/models/followup"

function getAnonymizedAnswer(answer, simulation) {
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
    }
    case "menage": {
      switch (answer.fieldName) {
        case "depcom":
        case "loyer":
        case "statut_occupation_logement":
        case "_logementType":
        case "_primoAccedant":
        case "_locationType": {
          return answer
        }
        default: {
          return null
        }
      }
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
          case "age":
          case "alternant":
          case "boursier":
          case "depcom":
          case "enfant_a_charge":
          case "nationalite":
          case "ressources": {
            return answer
          }
          case "date_naissance": {
            const dt = new Date(simulation.dateDeValeur)
            const dob = new Date(answer.value)
            return {
              id: answer.id,
              entityName: answer.entityName,
              fieldName: "age",
              value: Math.round(
                (dt.getTime() - dob.getTime()) / 365.25 / 24 / 60 / 60 / 1000
              ),
            }
          }
          default: {
            return null
          }
        }
      } else {
        return null
      }
    }
    default: {
      return null
    }
  }
}

function generateNewAll(answers, simulation) {
  return answers.map((a) => getAnonymizedAnswer(a, simulation)).filter((a) => a)
}

function main() {
  const aMonthAgo = new Date().getTime() - 31 * 24 * 60 * 60 * 1000
  const aWeekAgo = new Date().getTime() - 7 * 24 * 60 * 60 * 1000

  let followup_count = 0
  Followup.find({
    createdAt: { $lt: aMonthAgo },
    email: { $exists: true },
  })
    .sort({ _id: -1 })
    .cursor()
    .pipe(
      es.map(function (model, done) {
        model.email = undefined

        model.save(function (err) {
          if (err) {
            console.log(
              `Cannot save ${model.constructor.modelName} ${model.id}`
            )
            console.trace(err)
          }
          followup_count += 1
          done()
        })
      })
    )
    .on("end", function () {
      console.log(["Terminé", "Followup", followup_count].join(";"))
      process.exit()
    })
    .on("error", function (err) {
      console.trace(err)
      process.exit()
    })
    .resume()

  let simulation_count = 0
  Simulation.find({
    $or: [
      {
        dateDeValeur: { $lt: aMonthAgo },
        status: "new",
        hasFollowup: { $exists: true },
      },
      {
        dateDeValeur: { $lt: aWeekAgo },
        status: "new",
        hasFollowup: { $exists: false },
      },
    ],
  })
    .sort({ dateDeValeur: 1 })
    .cursor()
    .pipe(
      es.map(function (model, done) {
        model.status = "anonymized"

        const newAll = generateNewAll(model.answers.all, model)
        model.answers = {
          all: newAll,
          current: [],
        }

        model.save(function (err) {
          if (err) {
            console.log(
              `Cannot save ${model.constructor.modelName} ${model.id}`
            )
            console.trace(err)
          }
          simulation_count += 1
          done()
        })
      })
    )
    .on("end", function () {
      console.log(["Terminé", "Simulation", simulation_count].join(";"))
      process.exit()
    })
    .on("error", function (err) {
      console.trace(err)
      process.exit()
    })
    .resume()
}

main()
