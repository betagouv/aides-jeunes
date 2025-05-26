import { ViteSSG } from "vite-ssg"
import App from "./app.vue"

import router from "./router.js"

import StateService from "./plugins/state-service.js"
import ThemeService from "./plugins/theme-service.js"

import * as Sentry from "@sentry/vue"
import VueCookies from "vue-cookies"

import "@gouvfr/dsfr/dist/dsfr.min.css"
import "@gouvfr/dsfr/dist/utility/utility.min.css"

if (!import.meta.env.SSR) {
  import("@gouvfr/dsfr/dist/dsfr.module.min.js")
}

import "@/styles/aides-jeunes.css"

import AnalyticsDirective from "./directives/analytics.js"
import MailDirective from "./directives/mail.js"
import SelectOnClickDirective from "./directives/select-on-click.js"

// @ts-ignore
import iframeResizerContentWindow from "@iframe-resizer/parent"

import "dayjs/locale/fr.js"
import customParseFormat from "dayjs/plugin/customParseFormat"
import dayjs from "dayjs"
import { createPinia } from "pinia"
import { persistDataOnSessionStorage, useStore } from "@/stores/index.js"

const Resizer = {
  install: function () {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    iframeResizerContentWindow
  },
}
console.log("main.ts")
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

const initApp = ({ app, router, initialState, onSSRAppRendered }) => {
  const pinia = createPinia()
  app.use(pinia)

  if (import.meta.env.SSR) {
    onSSRAppRendered(() => {
      initialState.pinia = pinia.state.value
    })
  } else {
    pinia.state.value = initialState.pinia || {}

    if (
      typeof navigator !== "undefined" &&
      navigator.cookieEnabled &&
      process.env?.VITE_MATOMO_URL
    ) {
      import("vue-matomo").then(({ default: VueMatomo }) => {
        app.use(VueMatomo, {
          host: process.env.VITE_MATOMO_URL,
          trackerFileName: "piwik",
          siteId: process.env.VITE_MATOMO_ID,
          router: router,
          preInitActions: [
            [
              "setExcludedQueryParams",
              [
                "token",
                "situationId",
                "simulationId",
                "_ga",
                "surveyEmail",
                "code",
                "state",
              ],
            ],
          ],
        })
      })
    }
    if (process.env?.VITE_SENTRY_FRONTEND_DSN) {
      Sentry.init({
        app,
        dsn: process.env.VITE_SENTRY_FRONTEND_DSN,
        environment: process.env.VITE_CONTEXT,
        integrations: [Sentry.browserTracingIntegration({ router })],
        tracesSampleRate: 0.1,
        debug: "development" === process.env.VITE_CONTEXT,
        ignoreErrors: ["Can't find variable: gmo", /change_ua/],
      })
    }

    app.use(ThemeService)
    app.use(Resizer)
    app.directive("analytics", AnalyticsDirective)
    app.directive("mail", MailDirective)
    app.directive("selectOnClick", SelectOnClickDirective)
    app.use(StateService)
    app.use(VueCookies)
    router.beforeEach((to, from, next) => {
      const store = useStore(pinia)
      store.$onAction(persistDataOnSessionStorage)
      store.initialize()
      store.setOpenFiscaParameters()

      if (to.query.debug === "parcours") {
        store.setDebug(true)
      }
      next()
    })
  }
}

export const createApp = ViteSSG(
  App,
  {
    routes: router.options.routes,
  },
  initApp
)
