const ResponsiveDirective = {
  beforeMount(el, binding) {
    const MAX_WIDTH = 480
    const handleResize = () => {
      binding.value(window.innerWidth < MAX_WIDTH)
    }
    window.addEventListener("resize", handleResize)
    el._handleResize = handleResize // Store the function so we can remove it later
    handleResize() // Initialisation
  },
  unmounted(el) {
    window.removeEventListener("resize", el._handleResize)
  },
}

export default ResponsiveDirective
