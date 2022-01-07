<template>
  <div class="aj-website">
    <div class="aj-website-content">
      <Header1J1S />
      <slot />
    </div>
    <FooterJ1S />
  </div>
</template>

<script>
import Header1J1S from "@/components/header-1j1s"
import FooterJ1S from "./footer-1j1s"

export default {
  name: "BaseLayout",
  components: {
    FooterJ1S,
    Header1J1S,
  },
  created() {
    this.$router.isReady().then(() => {
      if (this.$route.query.debug === "parcours") {
        this.$store.dispatch("setDebug", true)
      }
    })
  },
}
</script>
