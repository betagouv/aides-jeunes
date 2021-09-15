const axios = require("axios")
const config = require("../config/index")

const AuthContribution = {
  async verifyIdentity(token) {
    return await axios.get(
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
      return res.send({
        msg: "Not found",
        statusCode: 404,
      })
    res.cookie("contribution_token", req.body.token)
    return res.redirect(301, "/")
  },
}

module.exports = AuthContribution
