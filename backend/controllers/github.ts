import axios from "axios"
import url from "url"
import config from "../config/index"

function current_uri(req) {
  return `${req.protocol}://${req.hostname}${
    process.env.NODE_ENV == "development" ? ":8080" : ""
  }${req.originalUrl}`
}

function authenticate(req, res) {
  return res.redirect(
    url.format({
      pathname: config.github.authorize_url,
      query: {
        client_id: config.github.client_id,
        redirect_uri: current_uri(req),
      },
    })
  )
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

const access = async (req, res, next) => {
  let github_payload = req.cookies && req.cookies["github_token"]
  if (req.query.code) {
    const result = await validateToken(req)
    if (result.status === 200 && result.data.access_token) {
      github_payload = result.data
      res.cookie("github_token", github_payload)
    }
  }
  if (github_payload) {
    try {
      const result = await validateCookieToken(github_payload)
      if (config.github.authorized_users.includes(result.data.login)) {
        return next()
      }
    } catch (e) {
      console.error(e)
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
