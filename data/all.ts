import { existsSync } from "node:fs"
import base from "./index.js"
import jamstackLoader from "jamstack-loader"
import path from "path"
import { JamstackLayout } from "./types/jamstack.d.js"

const __dirname = new URL(".", import.meta.url).pathname
let configFile = path.join(__dirname, "../contribuer/public/admin/config.yml")
let jamstack: JamstackLayout
if (existsSync(configFile)) {
  jamstack = jamstackLoader.get(configFile)
} else {
  configFile = path.join(__dirname, "../../contribuer/public/admin/config.yml")
  jamstack = jamstackLoader.get(`${configFile}`)
}

export default base.generate(jamstack)
