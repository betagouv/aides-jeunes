import { existsSync } from "node:fs"
import base from "./index.js"
import jamstackLoader from "@betagouv/jamstack-loader"
import path from "path"
import { Jamstack } from "./types/jamstack.d.js"

const __dirname = new URL(".", import.meta.url).pathname
let configFile = path.join(__dirname, "../contribuer/public/admin/config.yml")
let jamstack: Jamstack
if (existsSync(configFile)) {
  jamstack = jamstackLoader.get(configFile)
} else {
  configFile = path.join(__dirname, "../../contribuer/public/admin/config.yml")
  jamstack = jamstackLoader.get(`${configFile}`)
}

export default base.generate(jamstack)
