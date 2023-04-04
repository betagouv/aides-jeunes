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
  matomo: {
    id: -1,
  },
  sentry: {
    privateDsn: "https://userID:password@sentry.data.gouv.fr/17",
  },
  statistics: {
    url: "http://127.0.0.1:4000/benefits",
    version: 2,
  },
})
