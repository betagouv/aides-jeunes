import express from "express"
import { createServer as createViteServer } from "vite"
import configure from "./dist-server/configure.js"

async function createServer() {
  const app = express()

  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    //appType: 'custom' // don't include Vite's default HTML handling middlewares
  })
  configure({ app })
  // Use vite's connect instance as middleware
  app.use(vite.middlewares)
  /*
    app.use('*', async (req, res) => {
        // Since `appType` is `'custom'`, should serve response here.
        // Note: if `appType` is `'spa'` or `'mpa'`, Vite includes middlewares to handle
        // HTML requests and 404s so user middlewares should be added
        // before Vite's middlewares to take effect instead
    })
    */
  app.listen(8080)
}

createServer()
