const configureAPI = require('./configure')

module.exports = {
  devServer: {
    before: configureAPI
  }
}
