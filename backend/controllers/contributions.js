const axios = require("axios")

const API_URL = "http://localhost:8080"
const API_AUTH = "https://test-contribution.netlify.app"
const AuthContribution = {
  async verifyIdentity(token) {
    return await axios.get(`${API_AUTH}/.netlify/identity/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },
  async verify(req, res) {
    const verifyIdentity = await AuthContribution.verifyIdentity(req.body.token)
    if (verifyIdentity.status !== 200)
      return res.send({
        msg: "Not found",
        statusCode: 404,
      })
    res.cookie("contribution_token", req.body.token)
    return res.redirect(301, API_URL)
  },
}

module.exports = AuthContribution
