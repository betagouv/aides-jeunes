"use strict"

export default {
  baseURL:
    process.env.DEPLOY_URL || // Netlify deploy apps
    "http://localhost:8080",
  openfiscaAxeURL: "http://127.0.0.1:3000",
  openfiscaPublicURL: "http://127.0.0.1:2000",
  openfiscaTracerURL: "http://127.0.0.1:3000",
  teleserviceAccessTokens: {
    loiret_APA_test: "token",
    loiret_APA: "token",
    PNDS: "token",
  },
  matomo: {
    id: 170,
  },
  statistics: {},
}
