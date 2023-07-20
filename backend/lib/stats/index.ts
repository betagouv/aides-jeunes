import Promise from "bluebird"
import fs from "fs/promises"
import path from "path"
import dayjs from "dayjs"

import piwik from "./piwik.js"
import mongodb from "./mongodb.js"

const __dirname = new URL(".", import.meta.url).pathname
const nineWeeksAgo = dayjs().subtract(9, "week").toDate()
const yesterday = dayjs().subtract(1, "day").toDate()
const today = dayjs().toDate()

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
        // @ts-ignore
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
