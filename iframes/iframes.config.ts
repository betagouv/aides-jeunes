import path from "path"
import config from "../backend/config/index.js"
import webpack from "webpack"

const __dirname = new URL(".", import.meta.url).pathname
process.env.BASE_URL = config.baseURL
process.env.IFRAME_TITLE = config.iframeTitle

console.log("iframe-integration config", process.env.BASE_URL)

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
