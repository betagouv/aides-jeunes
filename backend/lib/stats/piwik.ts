import axios from "axios"

import config from "../../config/index.js"
import { Stats } from "../../types/stats.d.js"

interface PiwikParameters {
  period: string
  date: string
  method?: string
}

const baseParams = {
  module: "API",
  method: "API.get",
  format: "JSON",
  idSite: config.matomo.id,
}

async function callMatomoAPI(params: PiwikParameters) {
  const response = await axios.request({
    url: config.matomo.url,
    params: {
      ...baseParams,
      ...params,
    },
  })

  return response.data
}

function formatPiwik(data): Stats[] {
  const metrics = [
    {
      source: "nb_visits",
      name: "visit",
    },
  ]
  const dates = Object.keys(data)
  return metrics.map(function (metric) {
    const datapoints = dates.map(function (date) {
      return {
        date: date,
        value: data[date][metric.source],
      }
    })
    return {
      metric: metric.name,
      datapoints: datapoints,
    }
  })
}

async function getUsageData(fromDate: Date, toDate: Date) {
  const dateRange = `${fromDate.toISOString().slice(0, 10)},${toDate
    .toISOString()
    .slice(0, 10)}`
  const piwikparamsInterface = {
    period: "day",
    date: dateRange,
  }

  try {
    const data = await callMatomoAPI(piwikparamsInterface)
    return formatPiwik(data)
  } catch (error) {
    console.error(error)
    return []
  }
}

export { getUsageData, callMatomoAPI }
