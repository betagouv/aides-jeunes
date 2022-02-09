const axios = require("axios")
const config = require("../../config")

const url = config.mattermost.MATTERMOST_POST_URL || ""

async function post(text) {
  try {
    await axios
      .post(url, text, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .catch(function (error) {
        console.error(
          `Failed to send post result to mattermost ${error.response.status} ${error.response.data}`
        )
      })
  } catch (error) {
    console.log(`Failed to send post result to mattermost ${error}`)
  }
}

module.exports = {
  post,
}
