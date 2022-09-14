import express from "express"
import { createServer as createViteServer } from "vite"
import configure from "./dist-server/configure.js"
import mock from "./dist-server/mock.js"

const port = process.env.PORT || 8080

async function createServer() {
  const app = express()
  const vite = await createViteServer({
    server: { middlewareMode: true },
  })
  if (process.env.NODE_ENV === "front-only") {
    mock({ app })
  } else {
    configure({ app })
  }
  app.use(vite.middlewares)
  app.listen(port, () => {
    console.log(
      `Aides Jeunes server listening on port ${port}, in ${app.get("env")}`
    )
  })
}

createServer()
