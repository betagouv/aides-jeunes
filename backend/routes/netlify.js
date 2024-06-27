import cors from "cors"
import express from "express"
import jwt from "jsonwebtoken"

import moncompteproController from "../controllers/moncomptepro.js"
const api = express()

api.use(cors("*"))
api.get("/settings", (req, res) => {
  return res.json({
    external: {
      bitbucket: false,
      github: false,
      gitlab: false,
      google: false,
      mcp: false,
      email: false,
      // Astuce, on fait passer MCP pour du SAML
      // En fait, Netlify permet de faire de l'OpenId Connect (auth via redirections) via la config SAML
      // Pour allez plus loin, il faudrait prendre le temps de permet la gestion d'autres external providers oauth
      // cf.
      // https://github.com/netlify/netlify-identity-widget/blob/master/src/components/app.js#L167-L173
      saml: true,
    },
    disable_signup: true,
    autoconfirm: false,
  })
})

api.get(
  "/authorize",
  (req, res, next) => {
    req.state = "netlify"
    next()
  },
  moncompteproController.login,
)

api.get("/user", (req, res) => {
  const sessionSecret = process.env.GIT_GATEWAY_SHARED_SECRET
  const userInfo = jwt.verify(
    req.headers.authorization?.slice("Bearer ".length),
    sessionSecret,
  )
  return res.json(userInfo.user_metadata)
})

api.get("/logout", (req, res) => {
  return res.json({ message: "TODO" })
})

export default api
