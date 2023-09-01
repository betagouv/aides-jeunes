import Promise from "bluebird"
import fs from "fs/promises"
import path from "path"
import dayjs from "dayjs"

import { getUsageData } from "./piwik.js"
import mongodb from "./mongodb.js"
import getFunnelData from "./funnel-service.js"

const __dirname = new URL(".", import.meta.url).pathname
const nineWeeksAgo = dayjs().subtract(9, "week").toDate()
const yesterday = dayjs().subtract(1, "day").toDate()
const today = dayjs().toDate()

const statsFilePath = path.join(
  __dirname,
  "/../../../dist/documents/stats.json"
)

try {
  await fs.mkdir(path.dirname(statsFilePath), { recursive: true })
  const [mongoData, piwikData, funnelData] = await Promise.all([
    mongodb.getStats(nineWeeksAgo, today),
    getUsageData(nineWeeksAgo, yesterday),
    getFunnelData(),
  ])

  const data = {
    basic: [...mongoData.dailySituationCount, ...piwikData],
    survey: mongoData.survey,
    funnel: funnelData,
    computedAt: dayjs().toISOString(),
  }
  await fs.writeFile(statsFilePath, JSON.stringify(data, null, 2), "utf-8")
} catch (error) {
  console.error("error", error)
  process.exitCode = 1
} finally {
  mongodb.closeClient()
}
