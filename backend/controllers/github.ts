import axios from "axios"
import config from "../config/index.js"

function current_uri(req) {
  return `${req.protocol}://${req.hostname}${
    process.env.NODE_ENV == "development" ? ":8080" : ""
  }${req.originalUrl}`
}

function authenticate(req, res) {
  const params = new URLSearchParams({
    client_id: config.github.client_id,
    redirect_uri: current_uri(req),
  })

  const url = new URL(config.github.authorize_url)
  url.search = params.toString()

  return res.redirect(url.toString())
}

function validateToken(req) {
  return axios.post(
    config.github.access_token_url,
    {
      client_id: config.github.client_id,
      client_secret: config.github.client_secret,
      code: req.query.code,
    },
    {
      headers: { Accept: "application/json" },
    }
  )
}

function validateCookieToken(github_payload) {
  return axios.get(config.github.authenticated_url, {
    headers: {
      Accept: "application/json",
      Authorization: `token ${github_payload.access_token}`,
    },
  })
}

const MAX_ATTEMPTS = 3

const access = async (req, res, next) => {
  let github_payload = req.cookies && req.cookies["github_token"]
  let attemptCount = parseInt(req.cookies["attemptCount"]) || 0

  if (attemptCount >= MAX_ATTEMPTS) {
    return res.redirect("/error")
  }

  if (req.query.code) {
    const result = await validateToken(req)
    if (result.status === 200 && result.data.access_token) {
      github_payload = result.data
      res.cookie("github_token", github_payload)
    } else {
      attemptCount++
      res.cookie("attemptCount", attemptCount)
    }
  }
  if (github_payload) {
    try {
      const result = await validateCookieToken(github_payload)
      if (config.github.authorized_users.includes(result.data.login)) {
        return next()
      } else {
        attemptCount++
        res.cookie("attemptCount", attemptCount)
      }
    } catch (e) {
      attemptCount++
      res.cookie("attemptCount", attemptCount)
    }
  }
  return authenticate(req, res)
}

const postAuthRedirect = (req, res) => {
  if (req.query.redirect) {
    return res.redirect(req.query.redirect)
  } else {
    return res.redirect("/")
  }
}

export default { access, postAuthRedirect }
