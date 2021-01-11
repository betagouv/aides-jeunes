import 'core-js/stable'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import moment from 'moment'

import ScrollService from './plugins/ScrollService'
import StateService from './plugins/StateService'

import AsyncComputed from 'vue-async-computed'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'
import Vuelidate from 'vuelidate'
import VueMatomo from 'vue-matomo'

import 'template.data.gouv.fr/dist/main.css'
import 'font-awesome/scss/font-awesome.scss'
import '@/styles/main.scss'

import AnalyticsDirective from './directives/analytics'
import MailDirective from './directives/mail'
import SelectOnClickDirective from './directives/selectOnClick'

import { iframeResizerContentWindow } from 'iframe-resizer'

const Resizer = {
  install: function() {
    iframeResizerContentWindow
  }
}
AnalyticsDirective(Vue)
MailDirective(Vue)
SelectOnClickDirective(Vue)

if (process.env.NODE_ENV === 'production') {
  Raven
    .config('https://d5f975565d1b46f8a90f968071422ba5@sentry.data.gouv.fr/39')
    .addPlugin(RavenVue, Vue)
    .install()
}

Vue.use(AsyncComputed)
Vue.use(Resizer)
Vue.use(ScrollService)
Vue.use(StateService)
Vue.use(Vuelidate)

if (process.env.NODE_ENV === 'production') {
  Vue.use(VueMatomo, {
    host: 'https://stats.data.gouv.fr',
    trackerFileName: 'piwik',
    siteId: 102,
    router: router,
  })
}

if (window._paq) {
  window._paq.push(['setCustomVariable', 2, 'version', 'VueJS', 'visit']) // eslint-disable-line
}

Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

Vue.config.productionTip = false
moment.locale('fr')

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
