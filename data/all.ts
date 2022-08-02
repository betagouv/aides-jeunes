import path from "path"
import jamstackLoader from "jamstack-loader"
const jamstack = jamstackLoader.get(
  path.join(path.dirname("."), "contribuer/public/admin/config.yml")
)

import base from "./index.js"

export default base.generate(jamstack)
