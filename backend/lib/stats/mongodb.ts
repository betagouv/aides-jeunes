// eslint-disable-next-line @typescript-eslint/no-unused-vars
/* global emit: true */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare function emit(key, value)

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

async function extractSurveySummary2() {
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
  ])
}

function extractSurveySummary(db) {
  return db
    .collection("followups")
    .mapReduce(
      function () {
        const m = {
          asked: 1,
          failed: 2,
          nothing: 3,
          already: 4,
        }
        const benefitActionSurvey = this.surveys.find(
          (s) => s.type === SurveyCategory.BenefitAction
        )
        if (benefitActionSurvey.answers.length) {
          benefitActionSurvey.answers.sort(function (a, b) {
            return m[a.value] > m[b.value]
          })
          const month = benefitActionSurvey.repliedAt.toISOString().slice(0, 7)
          const answer = benefitActionSurvey.answers[0].value
          emit({ month, answer }, 1)
        }
      },
      function (k, values) {
        return values.reduce((sum, number: number) => sum + number)
      },
      {
        query: {
          "surveys.type": SurveyCategory.BenefitAction,
          "surveys.repliedAt": { $exists: true },
        },
        out: { inline: 1 },
        scope: {
          SurveyCategory,
        },
      }
    )
    .then((summary) =>
      summary.reduce(
        (set, row) => {
          const { month, answer } = row._id
          set.summary[answer] = (set.summary[answer] || 0) + row.value
          set.total += row.value
          set.historical[month] = set.historical[month] || {}
          set.historical[month][answer] = row.value
          return set
        },
        { summary: {}, historical: {}, total: 0 }
      )
    )
}

function extractSurveyDetails(db) {
  return db
    .collection("followups")
    .mapReduce(
      function () {
        const obj = {}
        this.benefits.forEach(function (b) {
          obj[b.id] = b.amount
        })
        const benefitActionSurvey = this.surveys.find(
          (s) => s.type === SurveyCategory.BenefitAction
        )
        benefitActionSurvey.answers.forEach(function (a) {
          emit({ id: a.id, state: a.value }, 1)
        })
      },
      function (k, values) {
        return values.reduce((sum, number: number) => sum + number)
      },
      {
        query: {
          "surveys.type": SurveyCategory.BenefitAction,
          "surveys.repliedAt": { $exists: true },
        },
        out: { inline: 1 },
        scope: {
          SurveyCategory,
        },
      }
    )
    .then((results) => {
      const groupMap = results.reduce(function (total, p) {
        const { id, state } = p._id
        total[id] = total[id] || { total: 0 }
        total[id][state] = p.value
        total[id].total += p.value
        return total
      }, {})

      const groups = Object.keys(groupMap).map((g) => {
        return Object.assign({ id: g }, groupMap[g])
      })

      groups.sort(function (a, b) {
        return a.total < b.total ? 1 : -1
      })

      return groups
    })
}

function manageMissingDBOrCollection(error) {
  console.log(error)
  if (
    error.message == "ns doesn't exist" ||
    error.message.match("does not exist")
  ) {
    return {
      dailySituationCount: [],
      survey: {
        summary: [],
        details: [],
      },
    }
  } else {
    throw error
  }
}

async function connect() {
  return await MongoClient.connect(config.mongodb_url)
    .then(saveClient)
    .then((client) => client.db())
}

async function getStats(fromDate, toDate): Promise<MongoStats | any> {
  try {
    const db = await connect()
    const dailies = await extractSimulationDailyCount(fromDate, toDate)
    const survey = await extractSurveySummary(db)
    const details = await extractSurveyDetails(db)

    console.log("!!", survey)
    console.log("??", await extractSurveySummary2())

    return {
      dailySituationCount: dailies,
      survey: {
        ...survey,
        details,
      },
    }
  } catch (error) {
    return manageMissingDBOrCollection(error)
  } finally {
    closeClient()
  }
}

export default { connect, closeClient, getStats }
