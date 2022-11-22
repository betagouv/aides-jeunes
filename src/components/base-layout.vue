<template>
  <div class="fr-page--full-height">
    <Header1J1S />
    <main role="main" class="fr-container">
      <slot />
    </main>
  </div>
  <FooterJ1S />
</template>

<script>
import Header1J1S from "@/components/header-1j1s.vue"
import FooterJ1S from "@/components/footer-1j1s.vue"
import { useStore } from "@/stores"

export default {
  name: "BaseLayout",
  components: {
    FooterJ1S,
    Header1J1S,
  },
  setup() {
    return {
      store: useStore(),
    }
  },
  created() {
    this.$router.isReady().then(() => {
      if (this.$route.query.debug === "parcours") {
        this.store.setDebug(true)
      }
    })
  },
}
</script>
