import { existsSync } from "node:fs"
import path from "path"
import base from "./index.js"
import jamstackLoader from "jamstack-loader"

const __dirname = new URL(".", import.meta.url).pathname
const configFile = path.join(__dirname, "../contribuer/public/admin/config.yml")

let jamstack
if (existsSync(configFile)) {
  jamstack = jamstackLoader.get(configFile)
} else {
  jamstack = jamstackLoader.get(path.join(__dirname, "../../contribuer/public/admin/config.yml"))
}

export default base.generate(jamstack)
