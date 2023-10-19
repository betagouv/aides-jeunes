import { MongoClient } from "mongodb"

import config from "../../config/index.js"
import { SurveyCategory } from "../../../lib/enums/survey.js"
import { MongoStats } from "../../types/stats.d.js"

import Simulations from "../../models/simulation.js"
import Followups from "../../models/followup.js"

let client

function saveClient(refDb) {
  client = refDb
  return client
}

function closeClient() {
  if (client) {
    client.close()
  }
}

async function extractSimulationDailyCount(fromDate, toDate) {
  const datapoints = await Simulations.aggregate([
    {
      $match: {
        $and: [
          {
            dateDeValeur: {
              $gt: fromDate,
              $lte: toDate,
            },
          },
          { modifiedFrom: { $exists: false } },
        ],
      },
    },
    {
      $group: {
        _id: {
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$dateDeValeur",
            },
          },
        },
        value: { $sum: 1 },
      },
    },
    {
      $project: {
        date: "$_id.date",
        value: "$value",
      },
    },
    { $unset: "_id" },
    { $sort: { date: 1 } },
  ])
  return [
    {
      metric: "simulation",
      datapoints,
    },
  ]
}

async function extractSurveySummary() {
  const surveySummary = await Followups.aggregate([
    {
      $match: {
        $and: [
          { surveyOptin: true },
          { surveys: { $exists: true, $ne: [] } },
          { "surveys.type": SurveyCategory.BenefitAction },
          { "surveys.answers": { $ne: [] } },
        ],
      },
    },
    {
      $project: {
        survey: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$surveys",
                cond: { $eq: ["$$this.type", SurveyCategory.BenefitAction] },
              },
            },
            0,
          ],
        },
      },
    },
    {
      $project: {
        _id: {
          value: {
            $switch: {
              branches: [
                {
                  case: { $in: ["asked", "$survey.answers.value"] },
                  then: "asked",
                },
                {
                  case: { $in: ["failed", "$survey.answers.value"] },
                  then: "failed",
                },
                {
                  case: { $in: ["nothing", "$survey.answers.value"] },
                  then: "nothing",
                },
                {
                  case: { $in: ["already", "$survey.answers.value"] },
                  then: "already",
                },
              ],
              default: null,
            },
          },
          month: {
            $dateToString: { format: "%Y-%m", date: "$survey.repliedAt" },
          },
        },
        total: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: { month: "$_id.month", type: "$_id.value" },
        total: { $sum: "$total" },
      },
    },
    {
      $facet: {
        total: [
          {
            $group: {
              _id: "total",
              total: { $sum: "$total" },
            },
          },
        ],
        summary: [
          {
            $group: {
              _id: "$_id.type",
              total: { $sum: "$total" },
            },
          },
          {
            $group: {
              _id: "$_id",
              data: {
                $push: { k: "$_id", v: "$total" },
              },
            },
          },
          {
            $replaceRoot: {
              newRoot: { $arrayToObject: "$data" },
            },
          },
          {
            $group: {
              _id: "summary",
              summary: { $mergeObjects: "$$ROOT" },
            },
          },
          {
            $replaceRoot: {
              newRoot: "$summary",
            },
          },
        ],
        historical: [
          {
            $group: {
              _id: "$_id.month",
              data: {
                $push: { k: "$_id.type", v: "$total" },
              },
            },
          },
          {
            $replaceRoot: {
              newRoot: {
                $mergeObjects: [{ $arrayToObject: "$data" }, { date: "$_id" }],
              },
            },
          },
          {
            $group: {
              _id: "$date",
              data: {
                $push: {
                  k: "$date",
                  v: {
                    $unsetField: {
                      field: "date",
                      input: "$$ROOT",
                    },
                  },
                },
              },
            },
          },
          {
            $replaceRoot: {
              newRoot: { $arrayToObject: "$data" },
            },
          },
          {
            $group: {
              _id: "historical",
              historical: { $mergeObjects: "$$ROOT" },
            },
          },
          {
            $replaceRoot: {
              newRoot: { $mergeObjects: "$historical" },
            },
          },
        ],
      },
    },
    {
      $project: {
        total: {
          $getField: { field: "total", input: { $arrayElemAt: ["$total", 0] } },
        },
        summary: { $arrayElemAt: ["$summary", 0] },
        historical: { $arrayElemAt: ["$historical", 0] },
      },
    },
  ])
  return surveySummary[0]
}

async function extractSurveyDetails() {
  return await Followups.aggregate([
    {
      $match: {
        $and: [
          { surveyOptin: true },
          { surveys: { $exists: true, $ne: [] } },
          { "surveys.type": SurveyCategory.BenefitAction },
          { "surveys.answers": { $ne: [] } },
        ],
      },
    },
    {
      $unwind: { path: "$surveys" },
    },
    {
      $project: {
        answers: "$surveys.answers",
      },
    },
    {
      $unwind: { path: "$answers" },
    },
    {
      $match: {
        $or: [
          { "answers.value": "already" },
          { "answers.value": "asked" },
          { "answers.value": "failed" },
          { "answers.value": "nothing" },
        ],
      },
    },
    {
      $group: {
        _id: { id: "$answers.id", value: "$answers.value" },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: { id: "$_id.id" },
        data: {
          $push: { k: "$_id.value", v: "$count" },
        },
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [{ $arrayToObject: "$data" }, { id: "$_id.id" }],
        },
      },
    },
    {
      $addFields: {
        total: { $sum: ["$already", "$asked", "$failed", "$nothing"] },
      },
    },
  ])
}

async function connect() {
  return await MongoClient.connect(config.mongodb_url)
    .then(saveClient)
    .then((client) => client.db())
}

async function getStats(fromDate, toDate): Promise<MongoStats | any> {
  const dailies = await extractSimulationDailyCount(fromDate, toDate)
  const survey = await extractSurveySummary()
  const details = await extractSurveyDetails()

  return {
    dailySituationCount: dailies,
    survey: {
      ...survey,
      details,
    },
  }
}

export default { connect, closeClient, getStats }
