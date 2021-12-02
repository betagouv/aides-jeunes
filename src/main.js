import "core-js/stable"
import { createApp, h } from "vue"
import App from "./App.vue"

import router from "./router"
import store from "./store"

import moment from "moment"

import ScrollService from "./plugins/ScrollService"
import StateService from "./plugins/StateService"

import * as Sentry from "@sentry/vue"
import useVuelidate from "@vuelidate/core"
import VueMatomo from "vue-matomo"

import "template.data.gouv.fr/dist/main.css"
import "font-awesome/scss/font-awesome.scss"
import "@/styles/main.scss"

import AnalyticsDirective from "./directives/analytics"
import MailDirective from "./directives/mail"
import SelectOnClickDirective from "./directives/selectOnClick"

import { iframeResizerContentWindow } from "iframe-resizer"

const Resizer = {
  install: function () {
    iframeResizerContentWindow
  },
}

const app = createApp({
  render: () => h(App),
})

app.directive("analytics", AnalyticsDirective)
app.directive("mail", MailDirective)
app.directive("selectOnClick", SelectOnClickDirective)

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    app,
    dsn: "https://80847fcdc7e74cbfb9d2f47751e42889@o548798.ingest.sentry.io/5709078",
  })
}

app.use(Resizer)
app.use(ScrollService)
app.use(StateService)
app.use(useVuelidate)

app.use(VueMatomo, {
  host: "https://stats.data.gouv.fr",
  trackerFileName: "piwik",
  siteId: process.env.VUE_APP_MATOMO_ID,
  router: router,
})

app.config.globalProperties.$filters = {
  capitalize(value) {
    if (!value) return ""
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  },
}

moment.locale("fr")

app.use(store)
app.use(router)
app.mount("#app")
