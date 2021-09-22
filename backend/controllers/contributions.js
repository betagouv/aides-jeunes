const axios = require("axios")
const config = require("../config/index")

const AuthContribution = {
  notAuthorized(res) {
    return res.send({
      msg: "Not authorized",
      statusCode: 401,
    })
  },
  verifyIdentity(token) {
    return axios.get(
      `${config.netlifyContributionURL}/.netlify/identity/user`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  },
  async verify(req, res) {
    const verifyIdentity = await AuthContribution.verifyIdentity(req.body.token)
    if (verifyIdentity.status !== 200)
      return AuthContribution.notAuthorized(res)
    res.cookie("contribution_token", req.body.token)
    return res.redirect(301, "/")
  },
  isLogged(req, res, next) {
    AuthContribution.verifyIdentity(req.body.token).then((verifyIdentity) => {
      if (verifyIdentity.status !== 200) {
        AuthContribution.notAuthorized(res)
      } else {
        next()
      }
    })
  },
}

module.exports = AuthContribution
