import analytics from "@/mixins/statistics.ts"

const AnalyticsDirective = {
  beforeMount(el, binding) {
    el.myAnalyticsHandler = () => {
      analytics.methods.sendStatistics(
        binding?.instance?.droits,
        binding.value.action,
        binding.value.name
      )
      const matomo = binding?.instance?.$matomo
      if (!matomo) {
        return
      }

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

export default AnalyticsDirective
