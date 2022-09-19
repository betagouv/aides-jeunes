import vue from "@vitejs/plugin-vue"
import legacy from "@vitejs/plugin-legacy"
import { createHtmlPlugin } from "vite-plugin-html"

import path from "path"
import { defineConfig } from "vite"
const __dirname = new URL(".", import.meta.url).pathname
import rollupYaml from "@rollup/plugin-yaml"
import AutoImport from "unplugin-auto-import/vite"

import config from "./dist-server/backend/config/index.js"
import benefits from "./dist-server/data/all.js"
const { baseURL, github, matomo, netlifyContributionURL, statistics } = config

const viteEnvironment = {
  VITE_BENEFIT_COUNT: benefits.all.filter((benefit) => !benefit.private).length,
  VITE_MATOMO_ID: matomo.id,
  VITE_CONTACT_EMAIL: "aides-jeunes@beta.gouv.fr",
  VITE_CONTEXT_NAME: "1jeune1solution",
  VITE_BASE_URL: baseURL,
  VITE_CONTEXT: process.env.CONTEXT,
  VITE_PR_URL: `${process.env.REPOSITORY_URL}/pull/${process.env.REVIEW_ID}`,
  VITE_BENEFIT_URL: `${github.repository_url}/blob/master/data/benefits`,
  VITE_NETLIFY_CONTRIBUTION_URL: netlifyContributionURL,
  VITE_STATS_URL: statistics?.url ? statistics.url : "",
  VITE_NETLIFY_PR: process.env.BRANCH,
}
viteEnvironment.VITE_TITLE = `Évaluez vos droits aux aides avec le simulateur de ${viteEnvironment.VITE_CONTEXT_NAME}`
viteEnvironment.VITE_DESCRIPTION = `7 minutes suffisent pour évaluer vos droits à ${viteEnvironment.VITE_BENEFIT_COUNT} aides avec le simulateur de ${viteEnvironment.VITE_CONTEXT_NAME}.`

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
            VITE_TITLE: viteEnvironment.VITE_TITLE,
            VITE_DESCRIPTION: viteEnvironment.VITE_DESCRIPTION,
            VITE_BASE_URL: viteEnvironment.VITE_BASE_URL,
            VITE_CONTEXT_NAME: viteEnvironment.VITE_CONTEXT_NAME,
          },
        },
      }),
      rollupYaml({
        include: ["data/**", "contribuer/**"],
      }),
      legacy({
        targets: ["defaults"],
      }),
      AutoImport({
        // targets to transform
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
          /\.md$/, // .md
        ],

        // global imports to register
        imports: [
          // presets
          "vue",
          "vue-router",
          // custom
          {
            "@vueuse/core": [
              // named imports
              "useMouse", // import { useMouse } from '@vueuse/core',
              // alias
              ["useFetch", "useMyFetch"], // import { useFetch as useMyFetch } from '@vueuse/core',
            ],
            axios: [
              // default imports
              ["default", "axios"], // import { default as axios } from 'axios',
            ],
            // "[package-name]": [
            //   "[import-names]",
            //   // alias
            //   ["[from]", "[alias]"],
            // ],
          },
        ],

        // Auto import for module exports under directories
        // by default it only scan one level of modules under the directory
        dirs: [
          // './hooks',
          // './composables' // only root modules
          // './composables/**', // all nested modules
          // ...
        ],

        // Filepath to generate corresponding .d.ts file.
        // Defaults to './auto-imports.d.ts' when `typescript` is installed locally.
        // Set `false` to disable.
        dts: "./auto-imports.d.ts",

        // Auto import inside Vue template
        // see https://github.com/unjs/unimport/pull/15 and https://github.com/unjs/unimport/pull/72
        vueTemplate: false,

        // Custom resolvers, compatible with `unplugin-vue-components`
        // see https://github.com/antfu/unplugin-auto-import/pull/23/
        resolvers: [
          /* ... */
        ],

        // Generate corresponding .eslintrc-auto-import.json file.
        // eslint globals Docs - https://eslint.org/docs/user-guide/configuring/language-options#specifying-globals
        eslintrc: {
          enabled: true, // Default `false`
          filepath: "./.eslintrc-auto-import.json", // Default `./.eslintrc-auto-import.json`
          globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
        },
      }),
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
      "process.env": viteEnvironment,
    },
  }
})
