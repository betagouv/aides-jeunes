const configureAPI = require('./configure')
const mock = require('./mock')
const before = process.env.NODE_ENV === 'front_only' ? mock : configureAPI

module.exports = {
  chainWebpack(config) {
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => ({
        ...options,
        compilerOptions: {
          ...options.compilerOptions,
          preserveWhitespace: true,
        },
      }));
  },
  devServer: {
    before: before
  }
}
