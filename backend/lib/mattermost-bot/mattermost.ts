import axios from "axios"
import config from "../../config/index.js"

async function post(text) {
  await axios
    .post(config.mattermost_post_url, text, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .catch(function (error) {
      console.log(`Failed to send post to mattermost ${error}`)
    })
}
export default { post }
