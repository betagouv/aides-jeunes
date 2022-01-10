const HtmlWebpackPlugin = require("html-webpack-plugin")
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer")
const { animation, baseURL, matomo, statistics } = require("./backend/config")
const configureAPI = require("./configure")
const mock = require("./mock")
const webpack = require("webpack")
const before = process.env.NODE_ENV === "front_only" ? mock : configureAPI
const parseArgs = require("minimist")
const benefits = require("./data/all")

process.env.VUE_APP_BENEFIT_COUNT = benefits.all.length
process.env.VUE_APP_MATOMO_ID = matomo.id
process.env.VUE_APP_VALIDATION_DELAY = animation?.delay || 0
process.env.VUE_APP_BASE_URL = baseURL
process.env.VUE_APP_CONTEXT = process.env.CONTEXT
process.env.VUE_APP_PR_URL = `${process.env.REPOSITORY_URL}/pull/${process.env.REVIEW_ID}`
process.env.VUE_APP_STATS_URL = statistics?.url ? statistics.url : ""

module.exports = {
  configureWebpack: (config) => {
    config.devtool = "source-map"
    config.plugins.push(
      new webpack.ContextReplacementPlugin(/moment[\\/]locale$/, /^\.\/(fr)$/)
    )
    config.plugins.push(
      new HtmlWebpackPlugin({
        filename: "[name]-map.xml",
        template: "public/sitemap.xml",
        favicon: "public/img/favicon/favicon.ico",
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
