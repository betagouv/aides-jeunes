const uuid = `uid_${Math.random().toString(12).slice(2)}`

export default {
  methods: {
    sendStatistics: function (benefits, event = "show", benefitsTotal) {
      if (
        window.navigator.doNotTrack !== "1" &&
        document.cookie.indexOf("piwik_ignore") < 0 &&
        process.env.NODE_ENV === "production" &&
        benefits &&
        benefits.length
      ) {
        const id =
          this && this.$matomo ? this.$matomo.getVisitorId() : undefined
        const benefitsStats = []
        const totalResults = benefits.length
        benefits.forEach(function (droit, i) {
          benefitsStats.push({
            benefit_id: droit.id,
            hash_id: id || uuid,
            benefit_index: i + 1,
            page_total: benefitsTotal || totalResults,
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
