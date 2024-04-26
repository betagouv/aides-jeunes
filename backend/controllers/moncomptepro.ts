import jwt from "jsonwebtoken"
import config from "../config/index.js"
import { Issuer } from "openid-client"
import Sentry from "@sentry/node"

const JWT_EXPIRATION_DELAY = 15552000 // 6 * 30 * 24 * 60 * 60 = 6 months
const MCP_TOKEN = "mcp_token"

const accompagnement = config.accompagnement

const {
  authorized_email_users,
  client_id,
  client_secret,
  provider,
  redirect_uri,
  scope,
} = config.moncomptepro

const { sessionSecret } = config
const baseUrl = config.baseURL

const getMcpClient = async () => {
  const mcpIssuer = await Issuer.discover(provider)

  return new mcpIssuer.Client({
    client_id,
    client_secret,
    redirect_uris: [redirect_uri],
    response_types: ["code"],
  })
}

const login = async (req, res) => {
  const client = await getMcpClient()
  const redirectUrl = client.authorizationUrl({
    scope,
    state: req.state,
  })
  res.redirect(redirectUrl)
}

const retrieveMcpAccessToken = async (req) => {
  try {
    const client = await getMcpClient()
    const params = client.callbackParams(req)
    // Gros hack sale
    // détourne le principe du state
    // Une alternative propre serait d'avoir deux urls de redirections disctinctes
    // pour gérer le cas
    // MCP pour l'outil d'accompagnement
    // MCP pour l'outil de contribution DecapCMS / NetlifyIdentity
    const tokenSet = await client.callback(
      redirect_uri,
      params,
      req.query.state ? { state: req.query.state } : undefined
    )
    return tokenSet.access_token
  } catch (error) {
    console.error("Error in retrieveMcpAccessToken: ", error)
    throw error
  }
}

const checkNetlify = async (req, res, next) => {
  if (req.query.state !== "netlify") {
    next()
  }
  const url = "http://localhost:3000/admin/index.html"
  const sessionSecret = process.env.GIT_GATEWAY_SHARED_SECRET
  const mcpAccessToken = await retrieveMcpAccessToken(req)
  const client = await getMcpClient()
  if (!mcpAccessToken) {
    throw new Error("No mcpAccessToken")
  }
  const user_metadata = await client.userinfo(mcpAccessToken)

  const accessToken = jwt.sign(
    {
      email: user_metadata.email,
      app_metadata: {
        provider: "saml",
      },
      user_metadata,
    },
    sessionSecret,
    {
      expiresIn: JWT_EXPIRATION_DELAY,
    }
  )

  const params = new URLSearchParams()
  params.append("access_token", accessToken)
  params.append("token_type", "bearer")

  // Une des magies de DecapCMS
  return res.redirect(`${url}#${params.toString()}`)
}

const access = async (req, res, next) => {
  try {
    const { cookies } = req
    let mcpToken = cookies && cookies[MCP_TOKEN]
    const mcpCode = req.query.code

    if (mcpCode) {
      const mcpAccessToken = await retrieveMcpAccessToken(req)
      const client = await getMcpClient()
      if (!mcpAccessToken) {
        throw new Error("No mcpAccessToken")
      }
      const userInfo = await client.userinfo(mcpAccessToken)
      if (!userInfo.email) {
        throw new Error("No userInfo email")
      }
      const isAuthorized = authorized_email_users.includes(userInfo.email)

      if (isAuthorized) {
        mcpToken = jwt.sign({ email: userInfo.email }, sessionSecret, {
          expiresIn: JWT_EXPIRATION_DELAY,
        })
        res.cookie(MCP_TOKEN, mcpToken)
      } else {
        res.clearCookie(MCP_TOKEN)
        return res.redirect(accompagnement.unauthorizedPath)
      }
    }

    if (mcpToken) {
      const userInfo = jwt.verify(mcpToken, sessionSecret)
      const isAuthorized = authorized_email_users.includes(userInfo.email)

      if (isAuthorized) {
        return next()
      } else {
        res.clearCookie(MCP_TOKEN)
        return res.redirect(accompagnement.unauthorizedPath)
      }
    }

    return login(req, res)
  } catch (error) {
    Sentry.captureException(error)
    res.clearCookie(MCP_TOKEN)
    return res.redirect(accompagnement.errorPath)
  }
}

const loginCallbackRedirect = (req, res) => {
  if (req.query.code) {
    res.redirect(accompagnement.path)
  } else {
    return res.redirect("/")
  }
}

const logout = async (req, res, next) => {
  try {
    res.clearCookie(MCP_TOKEN)
    const client = await getMcpClient()
    const redirectUrl = client.endSessionUrl({
      post_logout_redirect_uri: `${baseUrl}${accompagnement.path}`,
    })
    res.redirect(redirectUrl)
  } catch (e) {
    next(e)
  }
}

export default { access, checkNetlify, login, loginCallbackRedirect, logout }
