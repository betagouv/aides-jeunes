// eslint-disable-next-line @typescript-eslint/no-unused-vars
/* global emit: true */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare function emit(key, value)

import { MongoClient } from "mongodb"

import config from "../../config/index.js"
import { SurveyType } from "../../../lib/enums/survey.js"
import { MongoStatsLayout } from "../../types/stats.d.js"

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

function extractSimulationDailyCount(db, fromDate, toDate) {
  return db
    .collection("simulations")
    .mapReduce(
      function () {
        emit(this.dateDeValeur.toISOString().slice(0, 10), 1)
      },
      function (date, values) {
        return values.reduce((sum, number: number) => sum + number)
      },
      {
        out: {
          inline: 1,
        },
        query: {
          dateDeValeur: {
            $gte: fromDate,
            $lte: toDate,
          },
          modifiedFrom: {
            $exists: false,
          },
        },
      }
    )
    .then(formatMongo)
}

function formatMongo(data) {
  return [
    {
      metric: "simulation",
      datapoints: data.map(function (dateTuple) {
        return {
          date: dateTuple._id,
          value: dateTuple.value,
        }
      }),
    },
  ]
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
          (s) => s.type === SurveyType.benefitAction
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
          "surveys.type": SurveyType.benefitAction,
          "surveys.repliedAt": { $exists: true },
        },
        out: { inline: 1 },
        scope: {
          SurveyType,
        },
      }
    )
    .then((summary) =>
      summary.reduce(
        (set, row) => {
          const { month, answer } = row._id
          set.summary[answer] = row.value
          set.total += row.value
          if (!set.historical[month]) {
            set.historical[month] = {}
          }
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
          (s) => s.type === SurveyType.benefitAction
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
          "surveys.type": SurveyType.benefitAction,
          "surveys.repliedAt": { $exists: true },
        },
        out: { inline: 1 },
        scope: {
          SurveyType,
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
  return await MongoClient.connect(config.mongo.uri as string)
    .then(saveClient)
    .then((client) => client.db())
}

async function getStats(fromDate, toDate): Promise<MongoStatsLayout | any> {
  try {
    const db = await connect()
    const dailies = await extractSimulationDailyCount(db, fromDate, toDate)
    const survey = await extractSurveySummary(db)
    const details = await extractSurveyDetails(db)

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
