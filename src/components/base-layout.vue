<template>
  <div class="aj-website">
    <SkipLinks />
    <div class="aj-website-content">
      <Header1J1S />
      <slot />
    </div>
    <FooterJ1S />
  </div>
</template>

<script>
import Header1J1S from "@/components/header-1j1s"
import FooterJ1S from "@/components/footer-1j1s"
import SkipLinks from "@/components/skip-links"

export default {
  name: "BaseLayout",
  components: {
    FooterJ1S,
    Header1J1S,
    SkipLinks,
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
