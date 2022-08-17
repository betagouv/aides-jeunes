"use strict"
import development from "./development.js"

export default Object.assign(development, {
  animation: {
    delay: 0,
  },
  matomo: {
    id: -1,
  },
  sentry: {
    privateDsn: "https://userID:password@sentry.data.gouv.fr/17",
  },
  statistics: {},
  teleserviceAccessTokens: {
    live_node_test: "live_node_test",
    loiret_APA: "loiret_APA",
    loiret_APA_test: "loiret_APA_test",
  },
})
