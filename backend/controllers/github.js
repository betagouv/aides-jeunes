const axios = require("axios")
const url = require("url")
const config = require("../config")

function current_uri(req) {
  return `${req.protocol}://${req.hostname}${
    process.env.PORT ? ":" + process.env.PORT : ""
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

function validateCookieToken(req) {
  return axios.get(config.github.authenticated_url, {
    headers: {
      Accept: "application/json",
      Authorization: `token ${req.cookies["github_token"].access_token}`,
    },
  })
}

exports.access = async (req, res, next) => {
  if (req.cookies && req.cookies["github_token"]) {
    try {
      const result = await validateCookieToken(req)
      if (config.github.authorized_users.includes(result.data.login)) {
        return next()
      }
      // If cookie validation fails an error will be triggered
      // eslint-disable-next-line no-empty
    } catch {}
  }
  if (req.query.code) {
    const result = await validateToken(req, res)
    if (result.status === 200 && result.data.access_token) {
      res.cookie("github_token", result.data)
      return next()
    }
  }
  return authenticate(req, res)
}

exports.postAuthRedirect = (req, res) => {
  if (req.query.redirect) {
    return res.redirect(req.query.redirect)
  } else {
    return res.redirect("/")
  }
}
