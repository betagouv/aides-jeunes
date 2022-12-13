import { defineConfig, loadEnv } from "vite"

import config from "../backend/config/index"
import benefits from "../data/all"

const { baseURL, github, matomo, netlifyContributionURL, statistics } = config

export default defineConfig(async ({ mode }) => {
  process.env = Object.assign(process.env, loadEnv(mode, process.cwd(), ""))
  const context = "1jeune1solution"
  const benefitCount = benefits.all.filter((benefit) => !benefit.private).length
  const viteEnvironment = {
    VITE_BENEFIT_COUNT: benefitCount,
    VITE_MATOMO_ID: matomo.id,
    VITE_CONTACT_EMAIL: "aides-jeunes@beta.gouv.fr",
    VITE_CONTEXT_NAME: context,
    VITE_DESCRIPTION: `7 minutes suffisent pour évaluer vos droits à ${benefitCount} aides avec le simulateur de ${context}.`,
    VITE_BASE_URL: baseURL,
    VITE_CONTEXT: process.env.NODE_ENV,
    VITE_PR_URL: `${process.env.REPOSITORY_URL}/pull/${process.env.REVIEW_ID}`,
    VITE_BENEFIT_URL: `${github.repository_url}/blob/master/data/benefits`,
    VITE_NETLIFY_CONTRIBUTION_URL: netlifyContributionURL,
    VITE_STATS_URL: statistics?.url ? statistics.url : "",
    VITE_STATS_VERSION: statistics?.version,
    VITE_NETLIFY_PR: process.env.BRANCH,
    VITE_1J1S_URL: "https://www.1jeune1solution.gouv.fr",
    VITE_TITLE: `Évaluez vos droits aux aides avec le simulateur de ${context}`,
  }
  return {
    build: {
      rollupOptions: {
        input: "iframes/iframe-integration.js",
        output: {
          dir: "public/documents/",
          entryFileNames: "iframe-integration.js",
          manualChunks: undefined,
        },
      },
    },
    define: {
      "process.env": viteEnvironment,
    },
  }
})
