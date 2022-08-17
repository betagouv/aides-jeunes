import fs from "fs"
import path from "path"
import collections from "../../../data/all.js"
const __dirname = new URL(".", import.meta.url).pathname
const relative_path = path.join(__dirname, "../../../../data/collections.json")
fs.writeFileSync(relative_path, JSON.stringify(collections, null, 2))
//console.log(collections)
