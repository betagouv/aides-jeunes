import { useStore } from "@/stores/index.js"

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
  created() {
    this.$router.isReady().then(() => {
      if (this.$route.query.debug === "parcours") {
        const store = useStore()
        store.setDebug(true)
      }
    })
  },
}
