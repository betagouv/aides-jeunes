import express from "express"
import path from "path"
import fs from "fs"

const api = express()

api.use(express.json())

const routesPath = path.join(path.dirname(""), "backend/routes")
fs.readdirSync(routesPath).forEach(async (file) => {
  if (/(.*)\.(js$|coffee$)/.test(file)) {
    const routes = await import(`../../${routesPath}/${file}`)
    routes(api)
  }
})

api.all("*", function (req, res) {
  res.sendStatus(404)
})

export default api
