<template>
  <Header1J1S v-if="headerCollapse" :collapse="headerCollapse" />
  <main role="main" class="aj-iframe-content">
    <slot />
  </main>
  <div class="aj-iframe-footer">
    <p class="fr-text--center fr-p-1w">
      Simulateur propulsé par
      <a
        href="
      https://www.1jeune1solution.gouv.fr/"
        target="_blank"
      >
        la plateforme 1jeune1solution
      </a>
      - Accédez à nos
      <a href="https://mes-aides.1jeune1solution.beta.gouv.fr/cgu">CGU</a>
    </p>
  </div>
</template>

<script lang="ts">
import Header1J1S from "@/components/1j1s/header-1j1s.vue"
import { useStore } from "@/stores/index.js"
export default {
  name: "IFrameLayout",
  components: {
    Header1J1S,
  },
  setup() {
    return {
      store: useStore(),
    }
  },
  computed: {
    headerCollapse: function () {
      return this.store.iframeHeaderCollapse
    },
  },
}
</script>
