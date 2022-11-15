import analytics from "../mixins/statistics"

const MailDirective = {
  beforeMount(el, binding) {
    el.myAnalyticsHandler = () => {
      analytics.methods.sendStatistics({
        event: binding.value.action,
        benefitId: binding.value.name,
      })
      const matomo = binding?.instance?.$matomo
      if (!matomo) {
        return
      }

      // $analytics.eventTrack(/* name -> action */'show', { category: 'General', label: d.label });
      matomo?.trackEvent(
        binding.value.category || "defaultCategory",
        binding.value.action,
        binding.value.name,
        binding.value.value
      )
    }
    el.addEventListener("click", el.myAnalyticsHandler)
  },
  unmounted(el) {
    el.removeEventListener("click", el.myAnalyticsHandler)
  },
}

export default MailDirective
