import data from "../../data/all.js"
import Simulation from "../models/simulation.js"

export function benefits(req, res) {
  res.send(data.all)
}

const institutionList = Object.values(data.institutionsMap)
export function institutions(req, res) {
  res.send(institutionList)
}

export async function countSimulationByBikeTypeNumber(req, res) {
  const total: number = await Simulation.count({
    "answers.all.fieldName": "_interetsAidesVelo",
  })
  const aggregateResult: any[] = await Simulation.aggregate([
    { $unwind: "$answers.all" },
    { $match: { "answers.all.fieldName": "_interetsAidesVelo" } },
    {
      $group: {
        _id: {
          bikeTypeNumber: { $size: "$answers.all.value" },
        },
        count: {
          $sum: 1,
        },
      },
    },
    {
      $sort: { count: -1 },
    },
  ])
  const result = {
    total: total,
    countByBikeTypesNumber: aggregateResult.reduce((accum, item) => {
      accum[item._id.bikeTypeNumber] = item.count
      return accum
    }, {}),
  }
  res.send(result)
}

export async function countSimulationByBikeTypeNumberByBikeType(req, res) {
  const aggregateResult: any[] = await Simulation.aggregate([
    { $unwind: "$answers.all" },
    { $match: { "answers.all.fieldName": "_interetsAidesVelo" } },
    {
      $addFields: {
        bikeTypeNumber: { $size: "$answers.all.value" },
      },
    },
    { $unwind: "$answers.all.value" },
    {
      $group: {
        _id: {
          bikeTypeNumber: "$bikeTypeNumber",
          bikeType: "$answers.all.value",
        },
        count: {
          $sum: 1,
        },
      },
    },
    {
      $sort: { "_id.bikeType": -1 },
    },
  ])
  let total = 0

  const countByBikeTypeByBikeTypesNumber = aggregateResult.reduce(
    (accum, item) => {
      total += item.count
      if (!accum[item._id.bikeTypeNumber]) {
        accum[item._id.bikeTypeNumber] = {
          count: 0,
        }
      }
      accum[item._id.bikeTypeNumber][item._id.bikeType] = item.count
      accum[item._id.bikeTypeNumber].count += item.count

      return accum
    },
    {}
  )
  const result = {
    total: total,
    countByBikeTypeByBikeTypesNumber,
  }
  res.send(result)
}

export default { benefits, institutions }
