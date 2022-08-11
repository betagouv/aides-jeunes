import vue from "@vitejs/plugin-vue"
import legacy from "@vitejs/plugin-legacy"
import nodePolyfills from "rollup-plugin-polyfill-node"
import path from "path"
import { defineConfig } from "vite"
const __dirname = new URL(".", import.meta.url).pathname

import config from "./dist-server/backend/config/index.js"
import benefits from "./dist-server/data/all.js"
const { baseURL, github, matomo, netlifyContributionURL, statistics } = config

//const before = process.env.NODE_ENV === "front-only" ? mock : configureAPI

const variables = {
  VITE_BENEFIT_COUNT: benefits.all.filter((benefit) => !benefit.private).length,
  VITE_MATOMO_ID: matomo.id,
  VITE_CONTACT_EMAIL: "aides-jeunes@beta.gouv.fr",
  VITE_CONTEXT_NAME: "1jeune1solution",
  VITE_BASE_URL: baseURL,
  VITE_CONTEXT: process.env.CONTEXT,
  VITE_PR_URL: `${process.env.REPOSITORY_URL}/pull/${process.env.REVIEW_ID}`,
  VITE_BENEFIT_URL: `${github.repository_url}/blob/master/data/benefits`,
  VITE_NETLIFY_CONTRIBUTION_URL: `${netlifyContributionURL}`,
  VITE_STATS_URL: statistics?.url ? statistics.url : "",
  VITE_STATS_VERSION: statistics?.version ? statistics.version : 2,
  VITE_NETLIFY_PR: process.env.BRANCH,
  VITE_TITLE: `Évaluez vos droits aux aides avec le simulateur de ${process.env.VITE_CONTEXT_NAME}`,
  VITE_DESCRIPTION: `7 minutes suffisent pour évaluer vos droits à ${process.env.VITE_BENEFIT_COUNT} aides avec le simulateur de ${process.env.VITE_CONTEXT_NAME}.`,
}

export default defineConfig(async ({ command, mode }) => {
  return {
    server: {
      port: 8080,
      strictPort: true,
    },
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
  }
})
