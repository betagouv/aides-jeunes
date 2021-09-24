const MailDirective = (app) => {
  app.directive("analytics", {
    beforeMount: function (el, binding) {
      el.myAnalyticsHandler = () => {
        const matomo = binding.instance.$matomo
        if (!matomo) {
          return
        }

        // $analytics.eventTrack(/* name -> action */'show', { category: 'General', label: d.label });
        matomo.trackEvent(
          binding.value.category || "defaultCategory",
          binding.value.action,
          binding.value.name,
          binding.value.value
        )
      }
      el.addEventListener("click", el.myAnalyticsHandler)
    },
    unmounted: function (el) {
      el.removeEventListener("click", el.myAnalyticsHandler)
    },
  })
}

export default MailDirective
