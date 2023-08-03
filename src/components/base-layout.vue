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
        <li>
          <router-link
            class="fr-link"
            :to="{ hash: '#footer' }"
            aria-current="none"
            >Pied de page</router-link
          >
        </li>
      </ul>
    </nav>
  </div>
  <div class="aj-page--full-height">
    <Header1J1S>
      <div ref="navigation" tabindex="-1">
        <Navigation />
      </div>
    </Header1J1S>
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
  <div ref="footer" tabindex="-1">
    <Footer1J1S />
  </div>
</template>

<script>
import Header1J1S from "@/components/1j1s/header-1j1s.vue"
import Footer1J1S from "@/components/1j1s/footer-1j1s.vue"
import Navigation from "@/components/1j1s/navigation-1j1s.vue"
import layoutRouteMixin from "@/mixins/layout-route-mixin.ts"

export default {
  name: "BaseLayout",
  components: {
    Footer1J1S,
    Header1J1S,
    Navigation,
  },
  mixins: [layoutRouteMixin],
}
</script>
