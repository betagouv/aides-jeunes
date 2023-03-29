import analytics from "@/mixins/statistics.js"

function sendStatistics(instance, action, name) {
  analytics.methods.sendStatistics(instance?.droits, action, name)
}

export function trackMatomoEvent(instance, category, action, name, value) {
  const matomo = instance?.$matomo
  if (!matomo) {
    return
  }
  matomo.trackEvent(category || "defaultCategory", action, name, value)
}

export default sendStatistics
