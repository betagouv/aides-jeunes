const axios = require("axios")
const config = require("../config/index")

const AuthContribution = {
  async verifyIdentity(token) {
    try {
      // 200 if authentify then 404
      await axios.get(
        `${config.netlifyContributionURL}/.netlify/identity/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return true
    } catch {
      return false
    }
  },
  verify(req, res) {
    res.cookie("contribution_token", req.body.token)
    return res.redirect(301, "/")
  },
  async isLogged(req, res, next) {
    if (await AuthContribution.verifyIdentity(req.body.token)) {
      next()
    } else {
      res.send({
        msg: "Not authorized",
        statusCode: 401,
      })
    }
  },
}

module.exports = AuthContribution
