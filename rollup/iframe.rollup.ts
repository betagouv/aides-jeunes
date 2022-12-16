import path from "path"
import config from "../backend/config/index"
import webpack from "webpack"
import { build } from "vite"

process.env.BASE_URL = config.baseURL
export default function buildIframe() {
  return {
    name: "iframe builder",
    buildStart: () => {
      webpack(
        {
          mode: "production",
          entry: {
            "iframe-integration": path.resolve(
              __dirname,
              "../iframes/iframe-integration.js"
            ),
          },
          output: {
            path: path.resolve(__dirname, "../public/documents"),
            filename: "[name].js",
          },
          plugins: [new webpack.EnvironmentPlugin(["BASE_URL"])],
        },
        (err, stats) => {
          if (err || stats?.hasErrors()) {
            console.error("Iframe build failed")
          }
        }
      )
    },
  }
}
