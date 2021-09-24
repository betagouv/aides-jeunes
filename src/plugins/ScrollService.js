import SmoothScroll from "smooth-scroll"

const ScrollService = {
  install(app) {
    app.scroll = new SmoothScroll()

    function go(event, destination, offset) {
      event.preventDefault()
      app.scroll.animateScroll(destination, event.target, {
        updateURL: false,
        offset: function () {
          return offset || 0
        },
      })
    }

    app.config.globalProperties.$ScrollService = {
      go: go,
    }
  },
}

export default ScrollService
