import express from "express"
import path from "path"
import cors from "cors"
import { createServer as createViteServer } from "vite"

import configure from "./configure.js"
import mock from "./mock.js"

const __dirname = new URL(".", import.meta.url).pathname
const port = process.env.PORT || 8080

async function createServer() {
  const app = express()
  const vite = await createViteServer({
    server: { middlewareMode: true },
    configFile: `${__dirname}/../vite.config.ts`,
  })

  if (process.env.NODE_ENV === "front-only") {
    mock(app)
  } else {
    configure(app)
  }

  app.use(cors())
  app.use(
    "/documents/",
    express.static(path.join(__dirname, "../dist/documents"))
  )
  app.use(vite.middlewares)
  app.listen(port, () => {
    console.log(
      `Aides Jeunes server listening on port ${port}, in ${app.get("env")}`
    )
  })
}

createServer()
