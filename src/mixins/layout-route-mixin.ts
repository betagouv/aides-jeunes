export default {
  watch: {
    $route() {
      if (this.$route.hash) {
        const anchor = this.$route.hash.replace(/^#/, "")
        if (typeof this.$refs[anchor] !== "undefined") {
          this.$refs[anchor].focus()
        }
      }
    },
  },
}
