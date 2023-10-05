import dayjs from "dayjs"
import mongoose from "mongoose"
import epci from "@etalab/decoupage-administratif/data/epci.json" assert { type: "json" }

import config from "../../config/index.js"
import mongooseConfig from "../../config/mongoose.js"
import Simulations from "../../models/simulation.js"
import benefits from "../../../data/all.js"
import { StandardBenefit } from "../../../data/types/benefits.js"

// Note: for now, only EPCI are supported

mongooseConfig(mongoose, config)

const sixMonthsAgo = dayjs().subtract(6, "month").toDate()

interface Count {
  [key: string]: number
}

async function getSimulationCountPerEPCI(): Promise<Count> {
  const simulationCount = await Simulations.aggregate([
    {
      $match: {
        createdAt: {
          $gt: sixMonthsAgo,
        },
      },
    },
    {
      $unwind: "$answers.all",
    },
    {
      $match: {
        "answers.all.entityName": "menage",
        "answers.all.fieldName": "depcom",
      },
    },
    {
      $group: {
        _id: "$answers.all.value._epci",
        count: { $sum: 1 },
      },
    },
  ])

  await mongoose.connection.close()

  return simulationCount.reduce(
    (count: Count, result: { _id: string; count: number }): Count => {
      count[result._id] = result.count
      return count
    },
    {} as Count
  )
}

function getBenefitCountPerEPCI(): Count {
  return benefits.all.reduce(
    (count: Count, benefit: StandardBenefit): Count => {
      const { institution } = benefit
      if (institution.type !== "epci" || !institution.code_siren) {
        return count
      }

      count[institution.code_siren] = count[institution.code_siren] + 1 || 1
      return count
    },
    {} as Count
  )
}

export default async function getInstitutionsData() {
  const simulationNumberPerEPCI = await getSimulationCountPerEPCI()
  const benefitCountPerEPCI = getBenefitCountPerEPCI()

  return epci.map((epci) => {
    return {
      name: epci.nom,
      code: epci.code,
      type: epci.type,
      population: epci.populationTotale,
      simulationCount: simulationNumberPerEPCI[epci.code] || 0,
      benefitCount: benefitCountPerEPCI[epci.code] || 0,
    }
  })
}
