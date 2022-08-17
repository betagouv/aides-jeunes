const uuid = `uid_${Math.random().toString(12).slice(2)}`

export default {
  methods: {
    sendStatistics: function (benefits, event = "show", benefitId) {
      if (
        window.navigator.doNotTrack !== "1" &&
        document.cookie.indexOf("piwik_ignore") < 0 &&
        process.env.VUE_APP_STATS_URL?.length &&
        process.env.VUE_APP_STATS_VERSION &&
        benefits?.length
      ) {
        const id = this?.$matomo ? this.$matomo.getVisitorId() : uuid
        const benefitsStats = []
        const totalResults = benefits.length
        benefits.forEach(function (benefit, i) {
          if (!benefitId || benefitId == benefit.id) {
            benefitsStats.push({
              benefit_id: benefit.id,
              benefit_index: i + 1,
              event_type: event,
              hash_id: id,
              page_total: totalResults,
              version: process.env.VUE_APP_STATS_VERSION,
            })
          }
        })
        fetch(process.env.VUE_APP_STATS_URL, {
          body: JSON.stringify(benefitsStats),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        }).catch((error) => console.error(error))
      }
    },
  },
}
