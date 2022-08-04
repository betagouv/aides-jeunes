import path from "path"
import fs from "fs"
import base from "./index.js"
import jamstackLoader from "jamstack-loader"

let configFile = "contribuer/public/admin/config.yml"
let jamstack
if (fs.existsSync(configFile)) {
  jamstack = jamstackLoader.get(configFile)
} else {
  jamstack = jamstackLoader.get(`../${configFile}`)
}

export default base.generate(jamstack)
