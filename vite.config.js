import vue from "@vitejs/plugin-vue"
import legacy from "@vitejs/plugin-legacy"
import { createHtmlPlugin } from "vite-plugin-html"

import path from "path"
import { defineConfig } from "vite"
const __dirname = new URL(".", import.meta.url).pathname
//import rollupYaml from "@rollup/plugin-yaml"

import config from "./dist-server/backend/config/index.js"
import benefits from "./dist-server/data/all.js"
const { baseURL, github, matomo, netlifyContributionURL, statistics } = config

//const before = process.env.NODE_ENV === "front-only" ? mock : configureAPI

process.env.VITE_BENEFIT_COUNT = benefits.all.filter(
  (benefit) => !benefit.private
).length
process.env.VITE_MATOMO_ID = matomo.id
process.env.VITE_CONTACT_EMAIL = "aides-jeunes@beta.gouv.fr"
process.env.VITE_CONTEXT_NAME = "1jeune1solution"
process.env.VITE_BASE_URL = baseURL
process.env.VITE_CONTEXT = process.env.CONTEXT
process.env.VITE_PR_URL = `${process.env.REPOSITORY_URL}/pull/${process.env.REVIEW_ID}`
process.env.VITE_BENEFIT_URL = `${github.repository_url}/blob/master/data/benefits`
process.env.VITE_NETLIFY_CONTRIBUTION_URL = netlifyContributionURL
process.env.VITE_STATS_URL = statistics?.url ? statistics.url : ""
process.env.VITE_STATS_VERSION = statistics?.version ? statistics.version : 2
process.env.VITE_NETLIFY_PR = process.env.BRANCH
process.env.VITE_TITLE = `Évaluez vos droits aux aides avec le simulateur de ${process.env.VITE_CONTEXT_NAME}`
process.env.VITE_DESCRIPTION = `7 minutes suffisent pour évaluer vos droits à ${process.env.VITE_BENEFIT_COUNT} aides avec le simulateur de ${process.env.VITE_CONTEXT_NAME}.`

import YAML from "js-yaml"
import toSource from "tosource"
import { createFilter, makeLegalIdentifier } from "@rollup/pluginutils"

const defaults = {
  documentMode: "single",
  safe: true,
  transform: null,
}
const ext = /\.ya?ml$/

function yaml(opts = {}) {
  console.log("yaml opts", opts)
  const options = Object.assign({}, defaults, opts)
  const { documentMode, safe } = options
  const filter = createFilter(options.include, options.exclude)
  let loadMethod = null

  if (documentMode === "single") {
    loadMethod = safe ? YAML.load : YAML.safeLoad
  } else if (documentMode === "multi") {
    loadMethod = safe ? YAML.loadAll : YAML.safeLoadAll
  } else {
    this.error(
      `plugin-yaml → documentMode: '${documentMode}' is not a valid value. Please choose 'single' or 'multi'`
    )
  }

  return {
    name: "yaml",

    transform(content, id) {
      if (!ext.test(id)) return null
      if (!filter(id)) return null

      console.log("yaml, transform", id, content)

      let data = loadMethod(content)

      if (typeof options.transform === "function") {
        const result = options.transform(data, id)
        // eslint-disable-next-line no-undefined
        if (result !== undefined) {
          data = result
        }
      }

      const keys = Object.keys(data).filter(
        (key) => key === makeLegalIdentifier(key)
      )
      const code = `var data = ${toSource(data)};\n\n`
      const exports = ["export default data;"]
        .concat(keys.map((key) => `export var ${key} = data.${key};`))
        .join("\n")

      return {
        code: code + exports,
        map: { mappings: "" },
      }
    },
  }
}

export default defineConfig(async ({ command, mode }) => {
  return {
    server: {
      port: 8080,
      strictPort: true,
    },
    build: {
      rollupOptions: {
        plugins: [],
      },
      commonjsOptions: {
        exclude: ["lib"],
      },
      emptyOutDir: false,
    },
    plugins: [
      vue(),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            VITE_TITLE: process.env.VITE_TITLE,
            VITE_DESCRIPTION: process.env.VITE_DESCRIPTION,
            VITE_BASE_URL: process.env.VITE_BASE_URL,
            VITE_CONTEXT_NAME: process.env.VITE_CONTEXT_NAME,
          },
        },
      }),
      yaml({
        include: ["data/**", "contribuer/**"],
      }),
      // legacy({
      //   targets: ["defaults", "not IE 11"],
      // }),
    ],
    resolve: {
      preferBuiltins: false,
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@lib": path.resolve(__dirname, "dist-server/lib"),
        "@data": path.resolve(__dirname, "dist-server/data"),
      },
    },
    define: {
      "process.env": process.env,
    },
  }
})
