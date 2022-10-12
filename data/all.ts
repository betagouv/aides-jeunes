import { existsSync } from "node:fs"
import base from "./index"
import jamstackLoader from "jamstack-loader"
import path from "path"

let configFile = path.join(__dirname, "../contribuer/public/admin/config.yml")
let jamstack
if (existsSync(configFile)) {
  jamstack = jamstackLoader.get(configFile)
} else {
  configFile = path.join(__dirname, "../../contribuer/public/admin/config.yml")
  jamstack = jamstackLoader.get(`${configFile}`)
}

export default base.generate(jamstack)