<template>
  <div class="fr-skiplinks">
    <nav class="fr-container" role="navigation" aria-label="Accès rapide">
      <ul class="fr-skiplinks__list">
        <li>
          <router-link class="fr-link" to="#main">Contenu</router-link>
        </li>
        <li>
          <router-link class="fr-link" to="#navigation-menu">Menu</router-link>
        </li>
        <li>
          <router-link class="fr-link" to="#footer">Pied de page</router-link>
        </li>
      </ul>
    </nav>
  </div>
  <div class="aj-page--full-height">
    <Header1J1S />
    <main id="main" role="main" class="fr-container fr-container--fluid">
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
