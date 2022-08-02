import path from "path"
import jamstackLoader from "jamstack-loader"
const __dirname = new URL(".", import.meta.url).pathname
const jamstack = jamstackLoader.get(
  path.join(__dirname, "../contribuer/public/admin/config.yml")
)

import base from "./index.js"

export default base.generate(jamstack)
