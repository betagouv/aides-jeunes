import vue from "@vitejs/plugin-vue"
import legacy from "@vitejs/plugin-legacy"
import { createHtmlPlugin } from "vite-plugin-html"
import { sentryVitePlugin } from "@sentry/vite-plugin"

import path from "path"
import { defineConfig, loadEnv } from "vite"

const __dirname = new URL(".", import.meta.url).pathname

import config from "./backend/config/index.js"
import benefits from "./data/all.js"

import { visualizer } from "rollup-plugin-visualizer"
import generator from "./rollup/generator.rollup.js"

const buildId = Date.now().toString()

const {
  baseURL,
  github,
  matomo,
  netlifyContributionURL,
  statistics,
  franceConnect,
  sentry,
  smsService,
} = config

function createSentryPlugin() {
  if (!sentry.authToken || !sentry.project) {
    return null
  }
  return sentryVitePlugin({
    org: "betagouv",
    project: sentry.project,
    authToken: sentry.authToken,
    url: "https://sentry.incubateur.net/",
    sourcemaps: {
      assets: `./dist/assets/${buildId}/js/*.{js,map}`,
    },
  })
}

enum LayoutType {
  MesAidesLayout = "MesAidesLayout",
  BaseLayout = "BaseLayout",
}

export default defineConfig(async ({ mode }) => {
  process.env = Object.assign(process.env, loadEnv(mode, process.cwd(), ""))
  const viteEnvironment = {
    VITE_BENEFIT_COUNT: benefits.all.filter((benefit) => !benefit.private)
      .length,
    VITE_MATOMO_ID: matomo.id,
    VITE_CONTACT_EMAIL: "aides-jeunes@beta.gouv.fr",
    VITE_CONTEXT_NAME: "1jeune1solution",
    VITE_BASE_URL: baseURL,
    VITE_CONTEXT: process.env.NODE_ENV,
    VITE_PR_URL: `${process.env.REPOSITORY_URL}/pull/${process.env.REVIEW_ID}`,
    VITE_REPOSITORY_URL: github.repository_url,
    VITE_BENEFIT_URL: `${github.repository_url}/blob/master/data/benefits`,
    VITE_NETLIFY_CONTRIBUTION_URL: netlifyContributionURL,
    VITE_STATS_URL: statistics?.url ? statistics.url : "",
    VITE_STATS_VERSION: statistics?.version,
    VITE_NETLIFY_PR: process.env.BRANCH,
    VITE_1J1S_URL: "https://www.1jeune1solution.gouv.fr",
    VITE_LAYOUT: LayoutType.BaseLayout,
    // For now FranceConnect require an additional query params to be enabled
    VITE_FRANCE_CONNECT_ENABLED: Boolean(franceConnect.clientId),
    VITE_SHOW_SMS_TAB: smsService.show,
    VITE_SMS_DIALLING_CODES: smsService.internationalDiallingCodes,
  }
  viteEnvironment.VITE_TITLE = `Évaluez vos droits aux aides avec le simulateur de ${viteEnvironment.VITE_CONTEXT_NAME}`
  viteEnvironment.VITE_DESCRIPTION = `7 minutes suffisent pour évaluer vos droits à ${viteEnvironment.VITE_BENEFIT_COUNT} aides avec le simulateur de ${viteEnvironment.VITE_CONTEXT_NAME}.`

  return {
    server: {
      port: 8080,
      strictPort: true,
    },
    build: {
      manifest: true,
      rollupOptions: {
        plugins: [],
        output: {
          assetFileNames: (assetInfo) => {
            const extension = (assetInfo.name || "").match(/.*\.([a-z0-9]*)$/i)
            if (extension && extension[1]) {
              return `assets/${buildId}/${extension[1]}/[name]-[hash][extname]`
            } else {
              return `assets/${buildId}/other/[name]-[hash][extname]`
            }
          },
          chunkFileNames: () => {
            return `assets/${buildId}/js/[name]-[hash].js`
          },
          entryFileNames: () => {
            return `assets/${buildId}/js/[name]-[hash].js`
          },
        },
      },
      commonjsOptions: {
        exclude: ["lib"],
      },
      emptyOutDir: false,
      sourcemap: true,
    },
    plugins: [
      generator,
      vue(),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            VITE_TITLE: viteEnvironment.VITE_TITLE,
            VITE_DESCRIPTION: viteEnvironment.VITE_DESCRIPTION,
            VITE_BASE_URL: viteEnvironment.VITE_BASE_URL,
            VITE_CONTEXT_NAME: viteEnvironment.VITE_CONTEXT_NAME,
          },
        },
      }),
      legacy({
        targets: ["defaults"],
      }),
      visualizer(),
      createSentryPlugin(),
    ],
    resolve: {
      preferBuiltins: false,
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@lib": path.resolve(__dirname, "lib"),
        "@data": path.resolve(__dirname, "data"),
      },
    },
    define: {
      "process.env": viteEnvironment,
    },
  }
})
