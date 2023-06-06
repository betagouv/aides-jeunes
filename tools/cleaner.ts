import mongoose from "mongoose"
import dayjs from "dayjs"

import config from "../backend/config/index.js"
import mongooseConfig from "../backend/config/mongoose.js"
import Simulation from "../backend/models/simulation.js"
import { SimulationStatusEnum } from "../lib/enums/simulation.js"
import Followup from "../backend/models/followup.js"
import {
  anonymizeSimulation,
  anonymizeFollowup,
} from "../lib/cleaner-functions.js"

async function main() {
  const twoYearsAgo = dayjs().subtract(2, "year").valueOf()
  const sixMonthsAgo = dayjs().subtract(6, "month").valueOf()
  const aMonthAgo = dayjs().subtract(31, "day").valueOf()
  const aWeekAgo = dayjs().subtract(7, "day").valueOf()

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

  const oldFollowupsCursor = await Followup.find({
    createdAt: { $lt: sixMonthsAgo },
  }).cursor()
  for await (const oldFollowup of oldFollowupsCursor) {
    try {
      await Followup.deleteOne({ _id: oldFollowup._id })
      console.log(`Deleted followup: ${oldFollowup._id}`)
    } catch (err) {
      console.error(`Error deleting followup: ${oldFollowup._id}`, err)
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

  const oldSimulationsCursor = await Simulation.find({
    dateDeValeur: { $lt: twoYearsAgo },
  }).cursor()
  for await (const oldSimulation of oldSimulationsCursor) {
    try {
      await Simulation.deleteOne({ _id: oldSimulation._id })
      console.log(`Deleted simulation: ${oldSimulation._id}`)
    } catch (err) {
      console.error(`Error deleting simulation: ${oldSimulation._id}`, err)
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
