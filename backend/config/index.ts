import "dotenv/config"

import { Configuration } from "../types/config.js"

const config: Configuration = {
  env: process.env.NODE_ENV || "development",
  baseURL:
    process.env.MES_AIDES_ROOT_URL ||
    "https://mes-aides.1jeune1solution.beta.gouv.fr",
  franceConnect: {
    root: process.env.FRANCE_CONNECT_ROOT_URL,
    clientId: process.env.FRANCE_CONNECT_CLIENT_ID,
    clientSecret: process.env.FRANCE_CONNECT_CLIENT_SECRET,
    mesriEndpoint: process.env.FRANCE_CONNECT_MESRI_ENDPOINT,
    scopes: [
      "birthdate",
      "email",
      "mesri_inscription_etudiant",
      "mesri_inscription_autre",
      "mesri_admission",
      "mesri_etablissements",
    ].join(" "),
  },
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
  smtp: {
    host: process.env.SMTP_HOST || "localhost",
    port: process.env.SMTP_PORT || "7777",
    requireTLS: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  },
  github: {
    repository_url: "https://github.com/betagouv/aides-jeunes",
    access_token_url: "https://github.com/login/oauth/access_token",
    authenticated_url: "https://api.github.com/user",
    authorize_url: "https://github.com/login/oauth/authorize",
    client_secret: process.env.GITHUB_CLIENT_SECRET || "",
    client_id: process.env.GITHUB_CLIENT_ID || "",
    authorized_users: [
      "Allan-CodeWorks",
      "Cugniere",
      "guillett",
      "Shamzic",
      "yasmine-glitch",
      "baptou12",
    ],
  },
  matomo: {
    id: Number(process.env.MATOMO_ID) || 165,
    url: process.env.MATOMO_URL || "https://stats.data.gouv.fr",
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
  sentry: {
    dsn: process.env.SENTRY_BACKEND_URL || undefined,
    authToken: process.env.SENTRY_AUTH_TOKEN || undefined,
    project: process.env.SENTRY_PROJECT || undefined,
  },
  sessionSecret: process.env.SESSION_SECRET || "fghjdfjkdf785a-jreu",
  mattermost_post_url: process.env.MATTERMOST_POST_URL || "",
  iframeTitle:
    "Évaluez vos droits aux aides avec le simulateur de 1jeune1solution",
  smsService: {
    show: false,
    username: process.env.SMS_SERVICE_USERNAME || "",
    password: process.env.SMS_SERVICE_PASSWORD || "",
    url: "https://europe.ipx.com/restapi/v1/sms/send",
    internationalDiallingCodes: ["33", "262", "508", "590", "594", "596"],
  },
}

export default Object.freeze(config)
