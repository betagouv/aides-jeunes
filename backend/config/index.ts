/* eslint-disable no-console */
import { ConfigurationLayout } from "../types/config"

const env = process.env.NODE_ENV || "development"

const all: ConfigurationLayout = {
  animation: {
    delay: Number(process.env.ANIMATION_DELAY) || 300,
  },
  baseURL:
    process.env.MES_AIDES_ROOT_URL ||
    "https://mes-aides.1jeune1solution.beta.gouv.fr",
  env: env,
  github: {
    access_token_url: "https://github.com/login/oauth/access_token",
    authenticated_url: "https://api.github.com/user",
    authorize_url: "https://github.com/login/oauth/authorize",
    authorized_users: [
      "guillett",
      "Cugniere",
      "charlottelecuit",
      "Vanessa-D",
      "Kout95",
      "alizeeeeeee",
    ],
    client_id: process.env.GITHUB_CLIENT_ID || "",
    client_secret: process.env.GITHUB_CLIENT_SECRET || "",
    repository_url: "https://github.com/betagouv/aides-jeunes",
  },
  matomo: {
    id: Number(process.env.MATOMO_ID) || 165,
  },
  mattermost_post_url: process.env.MATTERMOST_POST_URL || "",
  mongo: {
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    uri: process.env.MONGODB_URL || "mongodb://localhost/db_aides_jeunes",
  },
  netlifyContributionURL:
    process.env.NETLIFY_CONTRIBUTION_URL ||
    "https://contribuer-aides-jeunes.netlify.app",
  openfiscaAxeURL: "https://betagouv.github.io/mes-aides-changent",
  openfiscaPublicURL:
    process.env.OPENFISCA_PUBLIC_ROOT_URL ||
    "https://openfisca.mes-aides.1jeune1solution.beta.gouv.fr",
  openfiscaTracerURL: "https://openfisca.github.io/tracer",
  openfiscaURL:
    process.env.OPENFISCA_INTERNAL_ROOT_URL || "http://localhost:2000",
  sendInBlue: {
    apiKey: process.env.SEND_IN_BLUE_PRIVATE_KEY || "privateKey",
  },
  sessionSecret: process.env.SESSION_SECRET || "fghjdfjkdf785a-jreu",
  statistics: {
    url:
      process.env.VUE_APP_STATS_URL ||
      "https://aides-jeunes-stats-recorder.osc-fr1.scalingo.io/benefits",
    version: Number(process.env.VUE_APP_STATS_VERSION) || 2,
  },
}

let override = {}
try {
  override = await import(`./${env}.js`).then((module) => module?.default)
  console.info(`Using specific configuration for ${env}.`)
} catch (e) {
  console.warn(`No specific configuration for ${env}`)
}

const config = Object.assign(all, override)
export default config
