import dayjs from "dayjs"
import epciList from "@etalab/decoupage-administratif/data/epci.json" assert { type: "json" }

import Simulations from "../../models/simulation.js"
import benefits from "../../../data/all.js"
import { StandardBenefit } from "../../../data/types/benefits.js"

// Note: for now, only EPCI are supported

const oneYearAgo = dayjs().subtract(1, "year").toDate()

interface MonthlyCount {
  month: string
  count: number
}

interface EPCIStats {
  [key: string]: MonthlyCount[]
}

interface Count {
  [key: string]: number
}

async function getSimulationCountPerEPCI(): Promise<Count> {
  const simulationCount = await Simulations.aggregate([
    {
      $match: {
        createdAt: {
          $gt: oneYearAgo,
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

// Temporary patch to fix MET69 type
// An issue has been opened on the data repository:
// https://github.com/etalab/decoupage-administratif/issues/42
// TODO: remove this patch when the issue is fixed
function patchEpciList(epci) {
  return epci.map((epci) => {
    if (epci.type === "MET69") {
      return {
        ...epci,
        type: "METRO",
      }
    }

    return epci
  })
}

async function getMonthlySimulationCountPerEPCI(): Promise<EPCIStats> {
  const simulationCount = await Simulations.aggregate([
    {
      $match: {
        createdAt: {
          $gt: oneYearAgo,
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
      $addFields: {
        epciCode: "$answers.all.value._epci",
      },
    },
    {
      $group: {
        _id: {
          epci: "$epciCode",
          month: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        },
        count: { $sum: 1 },
      },
    },
    {
      $match: {
        "_id.epci": { $ne: null },
      },
    },
    {
      $sort: {
        "_id.month": 1,
      },
    },
  ])

  return simulationCount.reduce((stats: EPCIStats, result) => {
    const { epci, month } = result._id
    if (!stats[epci]) {
      stats[epci] = []
    }
    stats[epci].push({
      month,
      count: result.count,
    })
    return stats
  }, {} as EPCIStats)
}

export default async function getInstitutionsData() {
  const epciPatched = patchEpciList(epciList)
  const simulationNumberPerEPCI = await getSimulationCountPerEPCI()
  const monthlySimulationsPerEPCI = await getMonthlySimulationCountPerEPCI()
  const benefitCountPerEPCI = getBenefitCountPerEPCI()

  return epciPatched.map((epci) => {
    return {
      name: epci.nom,
      code: epci.code,
      type: epci.type,
      population: epci.populationTotale,
      simulationCount: simulationNumberPerEPCI[epci.code] || 0,
      benefitCount: benefitCountPerEPCI[epci.code] || 0,
      monthlySimulations: monthlySimulationsPerEPCI[epci.code] || [],
    }
  })
}
