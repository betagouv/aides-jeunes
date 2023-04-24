import mongoose from "mongoose"

import config from "../backend/config/index.js"
import mongooseConfig from "../backend/config/mongoose.js"
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

function anonymizeSimulation(simulation) {
  const answers = simulation.answers.all
  const answersAnonymized = answers.map((answer) => getAnonymizedAnswer(answer, simulation)).filter((answer) => answer)

  simulation.answers = {
    all: answersAnonymized,
    current: [],
  }
  simulation.status = "anonymized"

  return simulation
}

async function main() {
  const aMonthAgo = Date.now() - 31 * 24 * 60 * 60 * 1000
  const aWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000

  let followup_count = 0
  const followupsCursor = await Followup.find({
    createdAt: { $lt: aMonthAgo },
    email: { $exists: true },
  })
    .sort({ _id: -1 })
    .cursor()

  for await (const followup of followupsCursor) {
    followup.email = undefined

    try {
      await followup.save()
      followup_count += 1
    } catch (err) {
      console.error(`Cannot save followup: ${followup.id}`)
      console.trace(err)
    }
  }

  console.log(["Terminé", "Followup", followup_count].join(";"))

  let simulation_count = 0
  const simulationsCursor = await Simulation.find({
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

  for await (const simulation of simulationsCursor) {
    const anonymizedSimulation = anonymizeSimulation(simulation)

    try {
      await anonymizedSimulation.save()
      simulation_count += 1
    } catch (err) {
      console.error(`Cannot save simulation: ${anonymizedSimulation.id}`)
    }
  }

  console.log(["Terminé", "Simulation", simulation_count].join(";"))
}

try {
  mongooseConfig(mongoose, config)
  await main()
} catch (err) {
  console.error(err)
} finally {
  await mongoose.connection.close()
  console.log("DB disconnected")
}
