import mongoose from "mongoose"
import dayjs from "dayjs"

import config from "../backend/config/index.js"
import mongooseConfig from "../backend/config/mongoose.js"
import Simulation from "../backend/models/simulation.js"
import { SimulationStatusEnum } from "../lib/enums/simulation.js"
import Followup from "../backend/models/followup"
import {
  anonymizeSimulation,
  anonymizeFollowup,
} from "../lib/cleaner-functions"


async function anonymizeFollowups() {
  const aMonthAgo = dayjs().subtract(31, "day").valueOf()

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
}

async function anonymizeSimulations() {
  const aMonthAgo = dayjs().subtract(31, "day").valueOf()
  const aWeekAgo = dayjs().subtract(7, "day").valueOf()

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

async function main() {
  await anonymizeFollowups()
  await anonymizeSimulations()
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
