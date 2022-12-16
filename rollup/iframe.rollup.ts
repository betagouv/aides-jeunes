import path from "path"
import config from "../backend/config/index"
import webpack from "webpack"
import fs from "fs"

process.env.BASE_URL = config.baseURL
/*
export default {
  mode: "production",
  entry: {
    "iframe-integration": path.resolve(__dirname, "./iframe-integration.js"),
  },
  output: {
    path: path.resolve(__dirname, "../public/documents"),
    filename: "[name].js",
  },
  plugins: [new webpack.EnvironmentPlugin(["BASE_URL"])],
}
*/
export default function buildIframe() {
  return {
    name: "iframe builder",
    buildStart: () => {
      const src = path.resolve(__dirname, "../iframes/iframe-integration.js")
      const dest = path.resolve(
        __dirname,
        "../public/documents/iframe-integration.js"
      )
      //fs.copyFileSync(src, dest)
      console.log("iframe built /////////////////////////////////////")
    },
  }
}
