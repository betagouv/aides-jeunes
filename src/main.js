import Vue from 'vue'
import App from './App.vue'
import router from './router'

import SituationService from './plugins/SituationService'
import Vuelidate from 'vuelidate'

import 'template.data.gouv.fr/dist/main.css'
import 'font-awesome/scss/font-awesome.scss'
import '@/styles/main.scss'

import MailDirective from './directives/mail'
MailDirective(Vue)

Vue.use(SituationService)
Vue.use(Vuelidate)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
