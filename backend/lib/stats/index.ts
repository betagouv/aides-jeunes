/* eslint-disable no-console */
import Promise from "bluebird"
//const fs = Promise.promisifyAll(require("fs"))
import fs from "fs/promises"
import mkdirp from "mkdirp"
import path from "path"

import piwik from "./piwik.js"
import mongodb from "./mongodb.js"

function dateDaysAgo(nb_days) {
  let date = new Date()
  date = new Date(date.toISOString().slice(0, 10))
  date.setDate(date.getDate() - nb_days)
  return date
}

const nineWeeksAgo = dateDaysAgo(7 * 9)
const yesterday = dateDaysAgo(1)
const today = dateDaysAgo(0)

// ./documents/ allow CORS access thank to an NGINX rule
const relative_path = `${path.dirname("")}/../../../dist/documents/stats.json`

mkdirp(path.dirname(relative_path)).then(() => {
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
