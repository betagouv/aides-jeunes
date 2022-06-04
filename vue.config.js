const HtmlWebpackPlugin = require("html-webpack-plugin")
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer")
const {
  animation,
  baseURL,
  github,
  matomo,
  netlifyContributionURL,
  statistics,
} = require("./dist-server/backend/config")
const configureAPI = require("./dist-server/configure")
const mock = require("./mock")
const webpack = require("webpack")
const before = process.env.NODE_ENV === "front-only" ? mock : configureAPI
const parseArgs = require("minimist")
const benefits = require("./data/all")

process.env.VUE_APP_BENEFIT_COUNT = benefits.all.filter(
  (benefit) => !benefit.private
).length
process.env.VUE_APP_MATOMO_ID = matomo.id
process.env.VUE_APP_VALIDATION_DELAY = animation?.delay || 0
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

module.exports = {
  configureWebpack: (config) => {
    config.devtool = "source-map"
    config.plugins.push(
      new webpack.ContextReplacementPlugin(/moment[\\/]locale$/, /^\.\/(fr)$/)
    )
    config.plugins.push(
      new HtmlWebpackPlugin({
        filename: "sitemap.xml",
        template: "public/map.xml",
        inject: false,
        templateParameters: { VUE_APP_BASE_URL: process.env.VUE_APP_BASE_URL },
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
