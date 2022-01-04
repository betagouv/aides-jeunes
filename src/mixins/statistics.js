const uuid = `uid_${Math.random().toString(12).slice(2)}`

export default {
  methods: {
    sendStatistics: function (benefits, event = "show", benefitId) {
      if (
        window.navigator.doNotTrack !== "1" &&
        document.cookie.indexOf("piwik_ignore") < 0 &&
        process.env.VUE_APP_STATS_URL?.length &&
        benefits?.length
      ) {
        const id = this?.$matomo ? this.$matomo.getVisitorId() : uuid
        const benefitsStats = []
        const totalResults = benefits.length
        benefits.forEach(function (benefit, i) {
          if (!benefitId || benefitId == benefit.id) {
            benefitsStats.push({
              benefit_id: benefit.id,
              hash_id: id,
              benefit_index: i + 1,
              page_total: totalResults,
              event_type: event,
            })
          }
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
