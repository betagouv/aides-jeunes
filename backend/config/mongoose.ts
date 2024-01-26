import bluebird from "bluebird"
import { Configuration } from "../types/config.js"

export default function (mongoose: any, config: Configuration) {
  mongoose.Promise = bluebird
  mongoose.set("strictQuery", false)

  if (!config.mongodb_url) {
    throw new Error("Please provide a `MONGODB_URL` environment variable")
  }

  mongoose
    .connect(config.mongodb_url)
    .then(() => console.info("DB connected"))
    .catch((e) => {
      throw new Error(e)
    })
}
