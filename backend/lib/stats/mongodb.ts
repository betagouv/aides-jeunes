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
    .then((r) => r.results || r)
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
          emit(benefitActionSurvey.answers[0].value, 1)
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
    .then((r) => r.results || r)
    .then((summary) =>
      summary.reduce(
        (set, row) => {
          set[row._id] = row.value
          set.total += row.value

          return set
        },
        { total: 0 }
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
          emit(`${a.id};${a.value}`, 1)
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
    .then((r) => r.results || r)
    .then((results) => {
      const groupMap = results.reduce(function (total, p) {
        const fields = p._id.split(";")
        const id = fields[0]
        const state = fields[1]
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

function getStats(fromDate, toDate): MongoStatsLayout | any {
  return connect()
    .then(function (db) {
      // MongoDB 2.4 (production) does not embed metadata of the operation, the result is directly available in the response
      // MongoDB 3.4 (dev environment) returns results with metadata and are available in the results property
      return extractSimulationDailyCount(db, fromDate, toDate).then(
        (dailies) => {
          return extractSurveySummary(db).then((summary) => {
            return extractSurveyDetails(db).then((details) => {
              return {
                dailySituationCount: dailies,
                survey: {
                  summary,
                  details,
                },
              }
            })
          })
        }
      )
    })
    .catch(manageMissingDBOrCollection)
    .finally(closeClient)
}

export default { connect, closeClient, getStats }
