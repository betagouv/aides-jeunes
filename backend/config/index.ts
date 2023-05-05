/* eslint-disable no-console */
import { ConfigurationLayout } from "../types/config.js"
const __dirname = new URL(".", import.meta.url).pathname

const env = process.env.NODE_ENV || "development"

const all: ConfigurationLayout = {
  env: env,
  animation: {
    delay: Number(process.env.ANIMATION_DELAY) || 300,
  },
  baseURL:
    process.env.MES_AIDES_ROOT_URL ||
    "https://mes-aides.1jeune1solution.beta.gouv.fr",
  openfiscaURL:
    process.env.OPENFISCA_INTERNAL_ROOT_URL || "http://127.0.0.1:2000",
  openfiscaAxeURL: "https://betagouv.github.io/mes-aides-changent",
  openfiscaPublicURL:
    process.env.OPENFISCA_PUBLIC_ROOT_URL ||
    "https://openfisca.mes-aides.1jeune1solution.beta.gouv.fr",
  openfiscaTracerURL: "https://openfisca.github.io/tracer",
  netlifyContributionURL:
    process.env.NETLIFY_CONTRIBUTION_URL ||
    "https://contribuer-aides-jeunes.netlify.app",
  sendInBlue: {
    apiKey: process.env.SEND_IN_BLUE_PRIVATE_KEY || "privateKey",
  },
  github: {
    repository_url: "https://github.com/betagouv/aides-jeunes",
    access_token_url: "https://github.com/login/oauth/access_token",
    authenticated_url: "https://api.github.com/user",
    authorize_url: "https://github.com/login/oauth/authorize",
    client_secret: process.env.GITHUB_CLIENT_SECRET || "",
    client_id: process.env.GITHUB_CLIENT_ID || "",
    authorized_users: [
      "alizeeeeeee",
      "Allan-CodeWorks",
      "Cugniere",
      "guillett",
      "Shamzic",
      "yasmine-glitch",
      "Valandr",
    ],
  },
  matomo: {
    id: Number(process.env.MATOMO_ID) || 165,
  },
  statistics: {
    url:
      process.env.VITE_STATS_URL ||
      "https://aides-jeunes-stats-recorder.osc-fr1.scalingo.io/benefits",
    version: Number(process.env.VITE_STATS_VERSION) || 2,
  },
  mongo: {
    uri: process.env.MONGODB_URL,
    options: {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    },
  },
  sessionSecret: process.env.SESSION_SECRET || "fghjdfjkdf785a-jreu",
  mattermost_post_url: process.env.MATTERMOST_POST_URL || "",
  iframeTitle:
    "Évaluez vos droits aux aides avec le simulateur de 1jeune1solution",
}

let override = {}
try {
  const loaddedConfiguration = await import(`${__dirname}${env}.js`)
  override = loaddedConfiguration?.default
  if (env !== "test") {
    console.info(`Using specific configuration for ${env}.`)
  }
} catch (e) {
  console.warn(`No specific configuration for ${env}`)
}

const config = Object.assign(all, override)
export default config
