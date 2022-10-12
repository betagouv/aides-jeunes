import { existsSync } from "node:fs"
import base from "./index"
import jamstackLoader from "jamstack-loader"

const configFile = "contribuer/public/admin/config.yml"
let jamstack
if (existsSync(configFile)) {
  jamstack = jamstackLoader.get(configFile)
} else {
  jamstack = jamstackLoader.get(`../${configFile}`)
}

export default base.generate(jamstack)
