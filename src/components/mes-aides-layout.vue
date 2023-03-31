<template>
  <div class="fr-skiplinks">
    <nav
      ref="skipLinks"
      class="fr-container"
      role="navigation"
      aria-label="Accès rapide"
    >
      <ul class="fr-skiplinks__list">
        <li>
          <router-link
            class="fr-link"
            :to="{ hash: '#main' }"
            aria-current="none"
            >Contenu</router-link
          >
        </li>
        <li>
          <router-link
            class="fr-link"
            :to="{ hash: '#navigation' }"
            aria-current="none"
            >Menu</router-link
          >
        </li>
      </ul>
    </nav>
  </div>
  <div class="aj-page--full-height">
    <HeaderMesAides>
      <div ref="navigation" tabindex="-1">
        <Navigation />
      </div>
    </HeaderMesAides>
    <main
      id="main"
      ref="main"
      role="main"
      class="fr-container fr-container--fluid aj-main-container"
      tabindex="-1"
    >
      <slot />
    </main>
  </div>
</template>

<script>
import HeaderMesAides from "@/components/header-mes-aides.vue"
import Navigation from "@/components/navigation.vue"
import { useStore } from "@/stores/index.ts"

export default {
  name: "MesAidesLayout",
  components: {
    HeaderMesAides,
    Navigation,
  },
  setup() {
    return {
      store: useStore(),
    }
  },
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
        this.store.setDebug(true)
      }
    })
  },
}
</script>
