import vue from "@vitejs/plugin-vue"
import legacy from "@vitejs/plugin-legacy"
import nodePolyfills from "rollup-plugin-polyfill-node"
import path from "path"
import { defineConfig } from "vite"

import config from "./dist-server/backend/config/index.js"
import configureAPI from "./dist-server/configure.js"
import mock from "./dist-server/mock.js"
import benefits from "./dist-server/data/all.js"

const { baseURL, github, matomo, netlifyContributionURL, statistics } = config
const __dirname = new URL(".", import.meta.url).pathname
const before = process.env.NODE_ENV === "front-only" ? mock : configureAPI

const variables = {
  VUE_APP_BENEFIT_COUNT: benefits.all.filter((benefit) => !benefit.private)
    .length,
  VUE_APP_MATOMO_ID: matomo.id,
  VUE_APP_CONTACT_EMAIL: "aides-jeunes@beta.gouv.fr",
  VUE_APP_CONTEXT_NAME: "1jeune1solution",
  VUE_APP_BASE_URL: baseURL,
  VUE_APP_CONTEXT: process.env.CONTEXT,
  VUE_APP_PR_URL: `${process.env.REPOSITORY_URL}/pull/${process.env.REVIEW_ID}`,
  VUE_APP_BENEFIT_URL: `${github.repository_url}/blob/master/data/benefits`,
  VUE_APP_NETLIFY_CONTRIBUTION_URL: `${netlifyContributionURL}`,
  VUE_APP_STATS_URL: statistics?.url ? statistics.url : "",
  VUE_APP_STATS_VERSION: statistics?.version ? statistics.version : 2,
  VUE_APP_NETLIFY_PR: process.env.BRANCH,
  VUE_APP_TITLE: `Évaluez vos droits aux aides avec le simulateur de ${process.env.VUE_APP_CONTEXT_NAME}`,
  VUE_APP_DESCRIPTION: `7 minutes suffisent pour évaluer vos droits à ${process.env.VUE_APP_BENEFIT_COUNT} aides avec le simulateur de ${process.env.VUE_APP_CONTEXT_NAME}.`,
}

export default defineConfig({
  build: {
    rollupOptions: {
      external: ["jamstack-loader"],
    },
    commonjsOptions: {
      exclude: ["lib"],
    },
  },
  plugins: [
    vue(),
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
    nodePolyfills(),
  ],
  resolve: {
    preferBuiltins: false,
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@lib": path.resolve(__dirname, "dist-server/lib"),
      "@data": path.resolve(__dirname, "dist-server/data"),
      fs: "rollup-plugin-polyfill-node",
      process: "rollup-plugin-polyfill-node",
      path: "./node_modules/rollup-plugin-polyfill-node/dist/index.js",
    },
  },
  define: {
    "process.env": variables,
  },
})
