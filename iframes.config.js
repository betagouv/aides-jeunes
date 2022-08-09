import path from "path"
import { fileURLToPath } from "url"
import config from "./dist-server/backend/config/index.js"
import webpack from "webpack"

const dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.BASE_URL = config.baseURL

export default {
  mode: "production",
  entry: {
    "iframe-integration": "./iframes/iframe-integration.js",
  },
  output: {
    path: path.resolve(dirname, "public/documents"),
    filename: "[name].js",
  },
  plugins: [new webpack.EnvironmentPlugin(["BASE_URL"])],
}
