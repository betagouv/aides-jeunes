"use strict"
import development from "./development.js"

export default Object.assign(development, {
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
})
