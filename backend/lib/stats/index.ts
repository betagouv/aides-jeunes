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

const relative_path = path.join(
  __dirname,
  "/../../../dist/documents/stats.json"
)

try {
  await fs.mkdir(path.dirname(relative_path), { recursive: true })
  const [mongoData, piwikData] = await Promise.all([
    mongodb.getStats(nineWeeksAgo, today),
    piwik.getUsageData(nineWeeksAgo, yesterday),
  ])

  const data = {
    basic: [...mongoData.dailySituationCount, ...piwikData],
    survey: mongoData.survey,
  }
  await fs.writeFile(relative_path, JSON.stringify(data, null, 2), "utf-8")
} catch (error) {
  console.error("error", error)
  process.exitCode = 1
} finally {
  mongodb.closeClient()
}
