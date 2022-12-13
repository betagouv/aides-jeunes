import config from "../backend/config/index"
process.env.BASE_URL = config.baseURL
// console.log(
//   "======================= iframeRollup ================================"
// )

export default {
  name: "iframeRollup",
  input: {
    iframe: "../iframes/iframe-integration.js",
  },
  output: {
    dir: "../public/documents",
    entryFileNames: "[name].js",
  },
}
