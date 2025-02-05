import path from "path"
import config from "../backend/config/index.js"
import webpack from "webpack"
import { fileURLToPath } from "url"

process.env.BASE_URL = config.baseURL
process.env.IFRAME_TITLE = config.iframeTitle

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
  mode: "production",
  entry: {
    "iframe-integration": path.resolve(__dirname, "./iframe-integration.ts"),
  },
  output: {
    path: path.resolve(__dirname, "../public/documents"),
    filename: "[name].js",
  },
  plugins: [new webpack.EnvironmentPlugin(["BASE_URL", "IFRAME_TITLE"])],
}
