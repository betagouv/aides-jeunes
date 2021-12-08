const uuid = `uid_${Math.random().toString(12).slice(2)}`
const url =
  process.env.VUE_APP_STATS_URL ||
  "https://aides-jeunes-stats-recorder.osc-fr1.scalingo.io/benefits"

export default {
  methods: {
    sendStatistics: (benefits, id, event = "display") => {
      if (benefits && benefits.length) {
        const benefitsStats = []
        const totalResults = benefits.length
        benefits.forEach(function (droit, i) {
          benefitsStats.push({
            benefit_id: droit.id,
            hash_id: id || uuid,
            benefit_index: i + 1,
            page_total: totalResults,
            event_type: event,
          })
        })
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(benefitsStats),
        }).catch((error) => console.error(error))
      }
    },
  },
}
