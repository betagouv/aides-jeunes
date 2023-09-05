"use strict"

export default {
  baseURL:
    process.env.DEPLOY_URL || // Netlify deploy apps
    "http://localhost:8080",
  openfiscaAxeURL: "http://127.0.0.1:3000",
  openfiscaPublicURL: "http://127.0.0.1:2000",
  openfiscaTracerURL: "http://127.0.0.1:3000",
  mongo: {
    uri:
      process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/dev-aides-jeunes",
    options: {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    },
  },
  animation: {
    delay: 0,
  },
  teleserviceAccessTokens: {
    live_node_test: "live_node_test",
    loiret_APA_test: "loiret_APA_test",
    loiret_APA: "loiret_APA",
  },
  smtp: {
    host: process.env.SMTP_HOST || "localhost",
    port: process.env.SMTP_PORT || "7777",
    requireTLS: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  },
  matomo: {
    id: -1,
  },
  sentry: {
    dsn: "https://userID:password@sentry.data.gouv.fr/17",
  },
  statistics: {},
  smsService: {
    show: true,
  },
}
