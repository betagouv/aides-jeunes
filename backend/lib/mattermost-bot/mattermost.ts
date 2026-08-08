import axios from "axios"
import config from "../../config/index.js"

async function post(text: string, postUrl?: string) {
  await axios.post(
    postUrl || config.mattermost_post_url,
    JSON.stringify({ text }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  )
}

export default { post }
