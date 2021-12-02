const MailDirective = {
  beforeMount(el, binding, vnode) {
    el.myAnalyticsHandler = () => {
      if (!vnode.context) {
        return
      }
      const matomo = vnode.context.$matomo
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
  unmounted(el) {
    el.removeEventListener("click", el.myAnalyticsHandler)
  },
}

export default MailDirective
