/* eslint-disable no-console */
const env = process.env.NODE_ENV || "development"

const all = {
  env: env,
  animation: {
    delay: process.env.ANIMATION_DELAY || 300,
  },
  baseURL: "https://mes-aides.1jeune1solution.beta.gouv.fr",
  openfiscaURL: process.env.OPENFISCA_URL || "http://localhost:2000",
  openfiscaAxeURL: "https://betagouv.github.io/mes-aides-changent",
  openfiscaPublicURL:
    "https://openfisca.mes-aides.1jeune1solution.beta.gouv.fr",
  openfiscaTracerURL: "https://openfisca.github.io/tracer",
  netlifyContributionURL:
    process.env.NETLIFY_CONTRIBUTION_URL ||
    "https://contribuer-aides-jeunes.netlify.app",
  sendInBlue: {
    apiKey: process.env.SEND_IN_BLUE_PRIVATE_KEY || "privateKey",
  },
  matomo: {
    id: 165,
  },
  statistics: {
    url:
      process.env.VUE_APP_STATS_URL ||
      "https://aides-jeunes-stats-recorder.osc-fr1.scalingo.io/benefits",
  },
  mongo: {
    uri: process.env.MONGODB_URL || "mongodb://localhost/dds",
    options: {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    },
  },
  sessionSecret: process.env.SESSION_SECRET || "fghjdfjkdf785a-jreu",
}

let override = {}
try {
  override = require("./" + env)
  console.info("Using specific configuration for " + env + ".")
} catch (e) {
  console.warn("No specific configuration for " + env + ".")
}

module.exports = Object.assign(all, override)
