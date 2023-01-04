import path from "path"
import config from "../backend/config/index"
import webpack from "webpack"

process.env.BASE_URL = config.baseURL
process.env.IFRAME_TITLE = config.iframeTitle

export default {
  mode: "production",
  entry: {
    "iframe-integration": path.resolve(__dirname, "./iframe-integration.js"),
  },
  output: {
    path: path.resolve(__dirname, "../public/documents"),
    filename: "[name].js",
  },
  plugins: [new webpack.EnvironmentPlugin(["BASE_URL", "IFRAME_TITLE"])],
}
