import path from "path"
import { fileURLToPath } from "url"
import webpack from "webpack"
import config from "./dist-server/backend/config/index.js"

const dirname = path.dirname(fileURLToPath(import.meta.url))

if (process.env.NODE_ENV === "production") {
  const port = process.env.PORT || 8080
  process.env.BASE_URL =
    process.env.MES_AIDES_ROOT_URL || `http://localhost:${port}`
} else {
  process.env.BASE_URL = config.baseURL
}

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
