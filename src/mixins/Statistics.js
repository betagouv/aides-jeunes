export default {
  methods: {
    sendStatistics: (benefits, event = "display") => {
      if (benefits && benefits.length) {
        const benefitsStats = []
        const totalResults = benefits.length
        benefits.forEach(function (droit, i) {
          benefitsStats.push({
            benefit_id: droit.id,
            hash_id: droit.id,
            benefit_index: i + 1,
            page_total: totalResults,
            event_type: event,
          })
        })
        fetch(
          "https://aides-jeunes-stats-recorder.osc-fr1.scalingo.io/benefits",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(benefitsStats),
          }
        ).catch((error) => console.error(error))
      }
    },
  },
}
