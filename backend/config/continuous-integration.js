"use strict"

module.exports = Object.assign(require("./development"), {
  animation: {
    delay: 0,
  },
  teleserviceAccessTokens: {
    live_node_test: "live_node_test",
    loiret_APA_test: "loiret_APA_test",
    loiret_APA: "loiret_APA",
  },
  matomo: {
    id: -1,
  },
  sentry: {
    privateDsn: "https://userID:password@sentry.data.gouv.fr/17",
  },
  statistics: {},
})
