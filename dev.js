import express from "express"
import { createServer as createViteServer } from "vite"
import configure from "./dist-server/configure.js"

async function createServer() {
  const app = express()
  const vite = await createViteServer({
    server: { middlewareMode: true },
  })
  configure({ app })
  app.use(vite.middlewares)
  app.listen(8080)
}

createServer()
