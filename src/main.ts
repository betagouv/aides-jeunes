import { createApp, h } from "vue"
import "@gouvfr/dsfr/dist/dsfr.min.css"
import "@gouvfr/dsfr/dist/utility/utility.min.css"
import "@gouvfr/dsfr/dist/dsfr.module.min.js"
import App from "./app.vue"

import router from "./router.js"

import StateService from "./plugins/state-service.js"
import ThemeService from "./plugins/theme-service.js"

import * as Sentry from "@sentry/vue"
import VueMatomo from "vue-matomo"
import VueCookies from "vue-cookies"

import "@/styles/aides-jeunes.css"

import AnalyticsDirective from "./directives/analytics.js"
import MailDirective from "./directives/mail.js"
import SelectOnClickDirective from "./directives/select-on-click.js"

// @ts-ignore
import { iframeResizerContentWindow } from "iframe-resizer"

import "dayjs/locale/fr.js"
import customParseFormat from "dayjs/plugin/customParseFormat"
import dayjs from "dayjs"
import { createPinia } from "pinia"
import { persistDataOnSessionStorage, useStore } from "@/stores/index.js"

const Resizer = {
  install: function () {
    iframeResizerContentWindow
  },
}
const pinia = createPinia()

const app = createApp({
  render: () => h(App),
})

app.directive("analytics", AnalyticsDirective)
app.directive("mail", MailDirective)
app.directive("selectOnClick", SelectOnClickDirective)

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    app,
    dsn: "https://77f2520f2558451c80b1b95131135bcd@sentry.incubateur.net/18",
  })
}

app.use(Resizer)
app.use(StateService)
app.use(ThemeService)
app.use(VueCookies)

if (navigator.cookieEnabled) {
  app.use(VueMatomo, {
    host: process.env.VITE_MATOMO_URL,
    trackerFileName: "piwik",
    siteId: process.env.VITE_MATOMO_ID,
    router: router,
  })
}

declare module "vue" {
  export interface ComponentCustomProperties {
    $theme: {
      current: string
      options: {
        title: string
        label: string
        value: string
      }[]
      update(string): void
    }
  }
}

dayjs.locale("fr")
dayjs.extend(customParseFormat)

app.use(pinia)
const store = useStore()
store.$onAction(persistDataOnSessionStorage)
store.initialize()
store.setOpenFiscaParameters()
app.use(router)

router.isReady().then(() => {
  if (router.currentRoute.value.query.debug === "parcours") {
    store.setDebug(true)
  }
})

app.mount("#app")
