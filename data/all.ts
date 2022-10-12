import { existsSync } from "node:fs"
import base from "./index.js"
import jamstackLoader from "jamstack-loader"
import path from "path"

let configFile = "../contribuer/public/admin/config.yml"
let jamstack
if (existsSync(configFile)) {
  configFile = path.join(__dirname, configFile)
  jamstack = jamstackLoader.get(configFile)
} else {
  configFile = path.join(__dirname, "..", configFile)
  jamstack = jamstackLoader.get(`${configFile}`)
}

export default base.generate(jamstack)
