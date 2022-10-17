import vue from "@vitejs/plugin-vue"
import legacy from "@vitejs/plugin-legacy"
import { createHtmlPlugin } from "vite-plugin-html"

import path from "path"
import { defineConfig, loadEnv } from "vite"

const __dirname = new URL(".", import.meta.url).pathname
import rollupYaml from "@rollup/plugin-yaml"

import config from "./backend/config/index"
import benefits from "./data/all"

const { baseURL, github, matomo, netlifyContributionURL, statistics } = config

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
    VITE_BENEFIT_URL: `${github.repository_url}/blob/master/data/benefits`,
    VITE_NETLIFY_CONTRIBUTION_URL: netlifyContributionURL,
    VITE_STATS_URL: statistics?.url ? statistics.url : "",
    VITE_STATS_VERSION: statistics?.version,
    VITE_NETLIFY_PR: process.env.BRANCH,
  }
  viteEnvironment.VITE_TITLE = `Évaluez vos droits aux aides avec le simulateur de ${viteEnvironment.VITE_CONTEXT_NAME}`
  viteEnvironment.VITE_DESCRIPTION = `7 minutes suffisent pour évaluer vos droits à ${viteEnvironment.VITE_BENEFIT_COUNT} aides avec le simulateur de ${viteEnvironment.VITE_CONTEXT_NAME}.`
  return {
    server: {
      port: 8080,
      strictPort: true,
    },
    build: {
      rollupOptions: {
        plugins: [],
      },
      commonjsOptions: {
        exclude: ["lib"],
      },
      emptyOutDir: false,
    },
    plugins: [
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
      rollupYaml({
        include: ["data/**", "contribuer/**"],
      }),
      legacy({
        targets: ["defaults"],
      }),
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
