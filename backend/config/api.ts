import express from "express"
import path from "path"
import fs from "fs"

const api = express()
api.use(express.json())

const routesPath = path.join(__dirname, "../routes")

async function loadRoutes() {
  const routes = await Promise.all(
    fs
      .readdirSync(routesPath)
      .filter((file) => /(.*)\.(ts|js$)/.test(file))
      .map(function (file) {
        return import(`${routesPath}/${file}`) //(api)
      })
  )
  routes.map((route) => route.default(api))
}

loadRoutes().then(() => {
  api.all("*", function (req, res) {
    res.sendStatus(404)
  })
})
export default api
