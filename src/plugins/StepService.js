const StepService = {
  install(Vue) {
    var context = require.context("@/lib/Steps", true, /\.js$/)
    var files = {}
    context.keys().forEach((filename) => {
      files[filename.slice(2, -3)] = context(filename).default
    })
    Vue.prototype.$steps = files
  },
}

export default StepService
