/* eslint-disable no-console */
const env = process.env.NODE_ENV || "development"

const all = {
  env: env,
  animation: {
    delay: process.env.ANIMATION_DELAY || 300,
  },
  baseURL:
    process.env.MES_AIDES_ROOT_URL ||
    "https://mes-aides.1jeune1solution.beta.gouv.fr",
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
  github: {
    access_token_url: "https://github.com/login/oauth/access_token",
    authenticated_url: "https://api.github.com/user",
    authorize_url: "https://github.com/login/oauth/authorize",
    client_secret: process.env.GITHUB_CLIENT_SECRET || "",
    client_id: process.env.GITHUB_CLIENT_ID || "",
    authorized_users: [
      "guillett",
      "Cugniere",
      "charlottelecuit",
      "Vanessa-D",
      "Kout95",
      "alizeeeeeee",
    ],
  },
  matomo: {
    id: 165,
  },
  statistics: {
    url:
      process.env.VUE_APP_STATS_URL ||
      "https://aides-jeunes-stats-recorder.osc-fr1.scalingo.io/benefits",
    version: process.env.VUE_APP_STATS_VERSION || 2,
  },
  mongo: {
    uri: process.env.MONGODB_URL || "mongodb://localhost/dds",
    options: {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    },
  },
  sessionSecret: process.env.SESSION_SECRET || "fghjdfjkdf785a-jreu",
  mattermost_post_url: process.env.MATTERMOST_POST_URL || "",
}

let override = {}
try {
  override = require("./" + env)
  console.info("Using specific configuration for " + env + ".")
} catch (e) {
  console.warn("No specific configuration for " + env + ".")
}

module.exports = Object.assign(all, override)
