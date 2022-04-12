const { generateToken } = require("../../utils")
const VERSION = 2
module.exports = {
  function: function (followup) {
    if (!followup.accessToken) {
      followup.accessToken = generateToken()
    }
    return followup
  },
  version: VERSION,
}
