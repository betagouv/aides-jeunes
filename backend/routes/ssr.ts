import { Express } from "express"
import { renderToString } from "vue/server-renderer"
import { createSSRApp } from "vue"

export default function (api: Express) {
  api.get("/ssr", (req, res) => {
    const app = createSSRApp({})
    renderToString(app).then((html) => {
      res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Test rendu Aide SSR</title>
          <link rel="stylesheet" href="./../../node_modules/@gouvfr/dsfr/dist/dsfr.min.css">
          <link rel="stylesheet" href="./../../node_modules/@gouvfr/dsfr/dist/utility/utility.min.css">
          <link rel="stylesheet" href="./../../src/styles/aides-jeunes.css">
          <script type="importmap">
            {
              "imports": {
                "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
              }
            }
          </script>
          <script type="module" src="/client.js"></script>
        </head>
        <body>
          <div id="app">${html}</div>
        </body>
      </html>
      `)
    })
  })
}
