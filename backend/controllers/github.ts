import axios from "axios"
import config from "../config/index.js"
import jwt from "jsonwebtoken"

const JWT_EXPIRATION_DELAY = 6 * 30 * 24 * 60 * 60 // 6 months

const {
  client_id,
  client_secret,
  authorize_url,
  access_token_url,
  authenticated_url,
  authorized_users,
} = config.github

const { sessionSecret } = config

const current_uri = (req) => {
  const port = process.env.NODE_ENV === "development" ? ":8080" : ""
  return `${req.protocol}://${req.hostname}${port}${req.originalUrl}`
}

const authenticate = (req, res) => {
  const params = new URLSearchParams({
    client_id,
    redirect_uri: current_uri(req),
  })

  const url = new URL(authorize_url)
  url.search = params.toString()

  res.redirect(url.toString())
}

const retrieveGithubAccessToken = async (code) => {
  try {
    const response = await axios.post(
      access_token_url,
      {
        client_id,
        client_secret,
        code,
      },
      {
        headers: { Accept: "application/json" },
      }
    )
    return response.data.access_token
  } catch (error) {
    console.error("Error in retrieveGithubAccessToken: ", error)
    throw error
  }
}

const getGithubUsername = async (token) => {
  try {
    const response = await axios.get(authenticated_url, {
      headers: {
        Accept: "application/json",
        Authorization: `token ${token}`,
      },
    })
    return response.data.login
  } catch (error) {
    console.error("Error in getGithubUsername: ", error)
    throw error
  }
}

const access = async (req, res, next) => {
  try {
    const { cookies } = req
    let github_login_token = cookies && cookies["github_login_token"]
    const githubCode = req.query.code

    if (githubCode) {
      const githubAccessToken = await retrieveGithubAccessToken(githubCode)
      const login = await getGithubUsername(githubAccessToken)
      const isAuthorized = authorized_users.includes(login)

      if (isAuthorized) {
        github_login_token = jwt.sign({ login }, sessionSecret, {
          expiresIn: JWT_EXPIRATION_DELAY,
        })
        res.cookie("github_login_token", github_login_token)
      } else {
        res.clearCookie("github_login_token")
        return res.redirect("/accompagnement?unauthorized")
      }
    }

    if (github_login_token) {
      const { login } = jwt.verify(github_login_token, sessionSecret)
      const isAuthorized = authorized_users.includes(login)

      if (isAuthorized) {
        return next()
      } else {
        res.clearCookie("github_login_token")
        return res.redirect("/accompagnement?unauthorized")
      }
    }

    return authenticate(req, res)
  } catch (error) {
    console.error("Error in access:", error)
    res.clearCookie("github_signed_token")
    return res.redirect("/accompagnement?error")
  }
}

const postAuthRedirect = (req, res) => {
  if (req.query.redirect) {
    res.redirect("/accompagnement")
  } else {
    return res.redirect("/")
  }
}

export default { access, postAuthRedirect }
