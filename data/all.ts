import { existsSync } from "node:fs"
import base from "./index.js"
import jamstackLoader from "@betagouv/jamstack-loader"
import { Jamstack } from "./types/jamstack.d.js"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

let configFile = path.resolve(
  __dirname,
  "../contribuer/public/admin/config.yml",
)
let jamstack: Jamstack

if (existsSync(configFile)) {
  jamstack = jamstackLoader.get(configFile)
} else {
  configFile = path.resolve(
    __dirname,
    "../../contribuer/public/admin/config.yml",
  )
  jamstack = jamstackLoader.get(configFile)
}

export default base.generate(jamstack)
