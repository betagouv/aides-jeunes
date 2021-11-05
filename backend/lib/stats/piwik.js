const { matomo } = require("../../config")

const axios = require("axios")

function formatPiwik(data) {
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

exports.getUsageData = function (fromDate, toDate) {
  return axios
    .request({
      url: "https://stats.data.gouv.fr/index.php",
      params: {
        module: "API",
        method: "API.get",
        format: "JSON",
        idSite: matomo.id,
        period: "day",
        date:
          fromDate.toISOString().slice(0, 10) +
          "," +
          toDate.toISOString().slice(0, 10),
      },
    })
    .then((response) => response.data)
    .then(formatPiwik)
    .catch(() => [])
}
