import SmoothScroll from 'smooth-scroll';

const ScrollService = {
  install (Vue) {
    Vue.scroll = new SmoothScroll()

    function go(event, destination, offset) {
        event.preventDefault();
        Vue.scroll.animateScroll(destination, event.target, {
            updateURL: false,
            offset: function() {
                return offset || 0
            }
        })
    }

    Vue.prototype.$ScrollService = {
        go: go
    }
  }
}

export default ScrollService
