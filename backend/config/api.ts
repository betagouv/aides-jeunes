import express from "express"
import path from "path"
import fs from "fs"
const __dirname = new URL(".", import.meta.url).pathname

const api = express()
api.use(express.json())

const routesPath = path.join(__dirname, "../routes")
async function loadRoutes() {
  const routes = await Promise.all(
    fs
      .readdirSync(routesPath)
      .filter((file) => /(.*)\.(js$)/.test(file))
      .map(function (file) {
        return import(`${routesPath}/${file}`) //(api)
      })
  )
  routes.map((route) => route.default(api))
}
await loadRoutes()

api.all("*", function (req, res) {
  res.sendStatus(404)
})

export default api
