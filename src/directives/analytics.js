const MailDirective = (Vue) => {
  Vue.directive('analytics', function(el, binding, vnode) {
    el.addEventListener('click', () => {
      const matomo = vnode.context.$matomo
      if (!matomo) {
        return
      }

      // $analytics.eventTrack(/* name -> action */'show', { category: 'General', label: d.label });
      matomo.trackEvent(
        binding.value.category || 'defaultCategory',
        binding.value.action,
        binding.value.name,
        binding.value.value
      )
    })
  })
}

export default MailDirective
