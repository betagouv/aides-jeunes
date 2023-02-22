import config from "../../config/index.js"
import { StatsLayout } from "./stats.d.js"

import axios from "axios"

function formatPiwik(data): StatsLayout[] {
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

function getUsageData(fromDate, toDate) {
  return axios
    .request({
      url: "https://stats.data.gouv.fr/index.php",
      params: {
        module: "API",
        method: "API.get",
        format: "JSON",
        idSite: config.matomo.id,
        period: "day",
        date: `${fromDate.toISOString().slice(0, 10)},${toDate
          .toISOString()
          .slice(0, 10)}`,
      },
    })
    .then((response) => response.data)
    .then(formatPiwik)
    .catch(() => [])
}

export default { getUsageData }
