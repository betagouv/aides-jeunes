<template>
  <Header1J1S v-if="headerCollapse" :collapse="headerCollapse" />
  <main role="main" class="aj-iframe-content">
    <slot />
  </main>
  <div class="aj-iframe-footer">
    <p class="fr-text--center fr-p-1w">
      Simulateur propulsé par
      <a :href="baseUrl" target="_blank"> la plateforme {{ contextName }} </a>
      - Accédez à nos
      <a :href="`${baseUrl}/cgu`">CGU</a>
    </p>
  </div>
</template>

<script lang="ts">
import Header1J1S from "@/components/1j1s/header-1j1s.vue"
import { useIframeStore } from "@/stores/iframe.js"
export default {
  name: "IFrameLayout",
  components: {
    Header1J1S,
  },
  setup() {
    return {
      store: useIframeStore(),
      baseUrl: process.env.VITE_BASE_URL,
      contextName: process.env.VITE_CONTEXT_NAME,
    }
  },
  computed: {
    headerCollapse: function () {
      return this.store.iframeHeaderCollapse
    },
  },
}
</script>
