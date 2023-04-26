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
      <div ref="navigation" tabindex="-1"> <NavigationMesAides /></div>
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
import HeaderMesAides from "@/components/mes-aides/header-mes-aides.vue"
import layoutRouteMixin from "@/mixins/layout-route-mixin.js"
import NavigationMesAides from "@/components/mes-aides/navigation-mes-aides.vue"

export default {
  name: "MesAidesLayout",
  components: {
    HeaderMesAides,
    NavigationMesAides,
  },
  mixins: [layoutRouteMixin],
}
</script>
