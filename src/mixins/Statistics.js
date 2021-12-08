const uuid = `uid_${Math.random().toString(12).slice(2)}`

export default {
  methods: {
    sendStatistics: function (benefits, event = "displayed") {
      const id = this && this.$matomo ? this.$matomo.getVisitorId() : undefined
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
        fetch(process.env.VUE_APP_STATS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(benefitsStats),
        }).catch((error) => console.error(error))
      }
    },
  },
}
