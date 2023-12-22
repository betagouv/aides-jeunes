import "dotenv/config"

import { Configuration } from "../types/config.js"

/**
 * NOTE: Les variables d'environement suivantes
 * Sont défini directement par pm2 en production
 * et ne sont donc pas dans les .env sur le serveur
 * - NODE_ENV
 * - MONGODB_URL
 * - PORT
 * - MES_AIDES_ROOT_URL
 * - OPENFISCA_INTERNAL_ROOT_URL
 * - OPENFISCA_PUBLIC_ROOT_URL
 */
const config: Configuration = {
  env: process.env.NODE_ENV || "development",
  baseURL:
    process.env.MES_AIDES_ROOT_URL ||
    process.env.DEPLOY_URL || // Netlify deploy apps
    "http://localhost:8080",
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
  openfiscaAxeURL:
    process.env.OPENFISCA_AXE_URL ||
    "https://betagouv.github.io/mes-aides-changent",
  openfiscaPublicURL:
    process.env.OPENFISCA_PUBLIC_ROOT_URL || "http://127.0.0.1:2000",
  openfiscaTracerURL:
    process.env.OPENFISCA_TRACER_URL || "https://openfisca.github.io/tracer",
  netlifyContributionURL:
    process.env.NETLIFY_CONTRIBUTION_URL ||
    "https://contribuer-aides-jeunes.netlify.app",
  rdvAideNumerique: {
    sharedSecret: process.env.RDV_AIDE_NUMERIQUE_SHARED_SECRET || "",
    baseUrl: process.env.RDV_AIDE_NUMERIQUE_BASE_URL || "",
  },
  smtp: {
    host: process.env.SMTP_HOST || "localhost",
    port: process.env.SMTP_PORT || "7777",
    requireTLS: process.env.SMTP_REQUIRE_TLS !== "false",
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
      "guillett",
      "Shamzic",
      "yasmine-glitch",
    ],
  },
  matomo: {
    id: Number(process.env.MATOMO_ID) || 170,
    url: process.env.MATOMO_URL || "https://stats.data.gouv.fr",
  },
  statistics: {
    url: process.env.VITE_STATS_URL || "http://localhost:4000/benefits",
    version: Number(process.env.VITE_STATS_VERSION) || 2,
  },
  mongodb_url:
    process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/dev-aides-jeunes",
  sentry: {
    dsn: process.env.SENTRY_BACKEND_URL,
    authToken: process.env.SENTRY_AUTH_TOKEN,
    project: process.env.SENTRY_PROJECT,
  },
  sessionSecret: process.env.SESSION_SECRET || "fghjdfjkdf785a-jreu",
  mattermost_post_url: process.env.MATTERMOST_POST_URL || "",
  teleserviceAccessTokens: {
    PNDS: process.env.PNDS_TOKEN || "token",
  },
  iframeTitle:
    "Évaluez vos droits aux aides avec le simulateur de 1jeune1solution",
  smsService: {
    show: process.env.SMS_SERVICE_SHOW !== "false",
    username: process.env.SMS_SERVICE_USERNAME || "",
    password: process.env.SMS_SERVICE_PASSWORD || "",
    url: "https://europe.ipx.com/restapi/v1/sms/send",
    internationalDiallingCodes: ["33", "262", "508", "590", "594", "596"],
  },
}

export default Object.freeze(config)
