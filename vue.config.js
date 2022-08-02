import HtmlWebpackPlugin from "html-webpack-plugin"
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer"
import parseArgs from "minimist"
import path from "path"
import config from "./dist-server/backend/config/index.js"
import configureAPI from "./dist-server/configure.js"
import mock from "./dist-server/mock.js"
import benefits from "./dist-server/data/all.js"

const { baseURL, github, matomo, netlifyContributionURL, statistics } = config
const __dirname = new URL(".", import.meta.url).pathname
const before = process.env.NODE_ENV === "front-only" ? mock : configureAPI

process.env.VUE_APP_BENEFIT_COUNT = benefits.all.filter(
  (benefit) => !benefit.private
).length
process.env.VUE_APP_MATOMO_ID = matomo.id
process.env.VUE_APP_CONTACT_EMAIL = "aides-jeunes@beta.gouv.fr"
process.env.VUE_APP_CONTEXT_NAME = "1jeune1solution"
process.env.VUE_APP_BASE_URL = baseURL
process.env.VUE_APP_CONTEXT = process.env.CONTEXT
process.env.VUE_APP_PR_URL = `${process.env.REPOSITORY_URL}/pull/${process.env.REVIEW_ID}`
process.env.VUE_APP_BENEFIT_URL = `${github.repository_url}/blob/master/data/benefits`
process.env.VUE_APP_NETLIFY_CONTRIBUTION_URL = `${netlifyContributionURL}`
process.env.VUE_APP_STATS_URL = statistics?.url ? statistics.url : ""
process.env.VUE_APP_STATS_VERSION = statistics?.version ? statistics.version : 2
process.env.VUE_APP_NETLIFY_PR = process.env.BRANCH
process.env.VUE_APP_TITLE = `Évaluez vos droits aux aides avec le simulateur de ${process.env.VUE_APP_CONTEXT_NAME}`
process.env.VUE_APP_DESCRIPTION = `7 minutes suffisent pour évaluer vos droits à ${process.env.VUE_APP_BENEFIT_COUNT} aides avec le simulateur de ${process.env.VUE_APP_CONTEXT_NAME}.`

export default {
  configureWebpack: (config) => {
    config.devtool = "source-map"
    config.resolve = {
      alias: {
        "@lib": path.resolve(__dirname, "dist-server/lib"),
        "@data": path.resolve(__dirname, "dist-server/data"),
        "@": path.resolve(__dirname, "src"),
      },
      extensions: [".ts", ".js", ".vue"],
    }
    config.plugins.push(
      new HtmlWebpackPlugin({
        filename: "sitemap.xml",
        template: "public/map.xml",
        inject: false,
        templateParameters: {
          VUE_APP_BASE_URL: process.env.VUE_APP_BASE_URL,
        },
      })
    )
    const args = parseArgs(process.argv.slice(2))
    if (args.env?.BUNDLEANALYZE) {
      config.plugins.push(new BundleAnalyzerPlugin({}))
    }
  },
  chainWebpack(config) {
    config.module
      .rule("file")
      .test(/\.(ico(2)?)(\?[a-z0-9=&.]+)?$/)
      .use("file-loader")
      .loader("file-loader")
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap((options) => ({
        ...options,
        compilerOptions: {
          ...options.compilerOptions,
          whitespace: "preserve",
        },
      }))
  },
  devServer: {
    onBeforeSetupMiddleware: before,
    client: {
      overlay: false,
    },
  },
}
