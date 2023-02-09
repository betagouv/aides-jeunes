/* eslint-disable no-console */
import Promise from "bluebird"
import fs from "fs/promises"
import path from "path"

import piwik from "./piwik.js"
import mongodb from "./mongodb.js"

function dateDaysAgo(nb_days) {
  let date = new Date()
  date = new Date(date.toISOString().slice(0, 10))
  date.setDate(date.getDate() - nb_days)
  return date
}

const __dirname = new URL(".", import.meta.url).pathname
const nineWeeksAgo = dateDaysAgo(7 * 9)
const yesterday = dateDaysAgo(1)
const today = dateDaysAgo(0)

// ./documents/ allow CORS access thank to an NGINX rule
const relative_path = path.join(
  __dirname,
  "/../../../dist/documents/stats.json"
)

fs.mkdir(path.dirname(relative_path), { recursive: true }).then(() => {
  Promise.all([
    mongodb.getStats(nineWeeksAgo, today),
    piwik.getUsageData(nineWeeksAgo, yesterday),
  ])
    .then(function (data) {
      return {
        basic: [].concat(data[0].dailySituationCount, data[1]),
        survey: data[0].survey,
      }
    })
    .then(function (data) {
      return fs.writeFile(relative_path, JSON.stringify(data, null, 2), "utf-8")
    })
    .catch(function (error) {
      console.error("error", error)
      process.exitCode = 1
    })
    .finally(mongodb.closeClient)
})
