const axios = require("axios")
const config = require("../config")

exports.callbackGithub = async (req, res) => {
  const code = req.query.code
  if (code) {
    const result = await axios.post(
      config.github.access_token_url,
      {
        client_id: config.github.client_id,
        client_secret: config.github.client_secret,
        code: code,
      },
      {
        headers: { Accept: "application/json" },
      }
    )
    if (result.status === 200 && result.data.access_token) {
      res.cookie("github_token", result.data)
      return res.redirect("/")
    }
  }
  return res.redirect("/")
}

exports.isAuthorized = async (req, res, next) => {
  const cookie = req.cookies["github_token"]
  if (cookie) {
    try {
      const result = await axios.get(config.github.authenticated_url, {
        headers: {
          Accept: "application/json",
          Authorization: `token ${cookie.access_token}`,
        },
      })
      if (config.github.authorized_users.includes(result.data.login)) {
        return next()
      }
    } catch (e) {
      console.log(e)
    }
  }
  return res.send({
    msg: "Not authorized",
    statusCode: 401,
  })
}
