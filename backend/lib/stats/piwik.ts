import config from "../../config/index.js"

import axios from "axios"

function formatPiwik(data) {
  const metrics = [
    {
      name: "visit",
      source: "nb_visits",
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
      datapoints: datapoints,
      metric: metric.name,
    }
  })
}

function getUsageData(fromDate, toDate) {
  return axios
    .request({
      params: {
        date: `${fromDate.toISOString().slice(0, 10)},${toDate
          .toISOString()
          .slice(0, 10)}`,
        format: "JSON",
        idSite: config.matomo.id,
        method: "API.get",
        module: "API",
        period: "day",
      },
      url: "https://stats.data.gouv.fr/index.php",
    })
    .then((response) => response.data)
    .then(formatPiwik)
    .catch(() => [])
}

export default { getUsageData }
