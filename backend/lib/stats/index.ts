import Promise from "bluebird"
import fs from "fs/promises"
import path from "path"
import dayjs from "dayjs"
import Sentry from "@sentry/node"

import { getUsageData } from "./piwik.js"
import mongodb from "./mongodb.js"
import getFunnelData from "./funnel-service.js"
import getInstitutionsData from "./institutions.js"

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
  const [mongoData, piwikData, funnelData, institutionsData] =
    await Promise.all([
      mongodb.getStats(nineWeeksAgo, today),
      getUsageData(nineWeeksAgo, yesterday),
      getFunnelData(),
      getInstitutionsData(),
    ])

  const data = {
    basic: [...mongoData.dailySituationCount, ...piwikData],
    survey: mongoData.survey,
    funnel: funnelData,
    institutions: institutionsData,
    computedAt: dayjs().toISOString(),
  }
  await fs.writeFile(statsFilePath, JSON.stringify(data, null, 2), "utf-8")
} catch (error) {
  Sentry.captureException(error)
  process.exitCode = 1
} finally {
  mongodb.closeClient()
}
