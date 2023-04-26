import mongoose from "mongoose"

import config from "../backend/config/index.js"
import mongooseConfig from "../backend/config/mongoose.js"
import Simulation, {
  SimulationStatusEnum,
} from "../backend/models/simulation.js"
import Followup from "../backend/models/followup"
import {
  anonymizeSimulation,
  anonymizeFollowup,
} from "../lib/cleaner-functions"

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
    const followupAnonymized = anonymizeFollowup(followup)

    try {
      await followupAnonymized.save()
      followup_count += 1
    } catch (err) {
      console.error(`Cannot save followup: ${followupAnonymized.id}`)
      console.trace(err)
    }
  }

  console.log(["Terminé", "Followup", followup_count].join(";"))

  let simulation_count = 0
  const simulationsCursor = await Simulation.find({
    $or: [
      {
        dateDeValeur: { $lt: aMonthAgo },
        status: SimulationStatusEnum.NEW,
        hasFollowup: { $exists: true },
      },
      {
        dateDeValeur: { $lt: aWeekAgo },
        status: SimulationStatusEnum.NEW,
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
