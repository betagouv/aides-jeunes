import path from "path"
import { get } from "jamstack-loader"
const jamstack = get(
  path.join(__dirname, "../contribuer/public/admin/config.yml")
)

const base = require("./index")

export default base.generate(jamstack)
