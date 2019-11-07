
const MailDirective = (Vue) => {
  Vue.directive('analytics', {
      bind: function(el, binding, vnode) {

        el.myAnalyticsHandler = () => {
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
        }
        el.addEventListener('click', el.myAnalyticsHandler)
      },
      unbind: function(el) {
        el.removeEventListener('click', el.myAnalyticsHandler)
      }
  })
}

export default MailDirective
