<template>
  <component :is="layout">
    <BandeauDemo />
    <router-view />
  </component>
</template>

<script lang="ts">
import iFrameLayout from "@/components/iframe-layout.vue"
import BandeauDemo from "@/components/bandeau-demo.vue"
import context from "@/context/index.js"
import { useThemeStore } from "@/stores/theme.js"

const { BaseLayout, MesAidesLayout } = context

export default {
  name: "App",
  components: {
    BandeauDemo,
    BaseLayout,
    iFrameLayout,
    MesAidesLayout,
  },
  setup() {
    const store = useStore()
    const themeStore = useThemeStore()
    return {
      store,
      themeStore,
    }
  },
  computed: {
    layout: function () {
      return this.store.inIframe
        ? "iFrameLayout"
        : (process.env.VITE_LAYOUT as string)
    },
  },
  mounted() {
    const params = new URLSearchParams(document.location.search.substring(1))
    if (params.has("iframe")) {
      this.store.setIframeOrigin(null)
    }

    if (params.has("data-with-logo")) {
      this.store.setIframeHeaderCollapse(params.get("data-with-logo"))
    }

    if (params.has("theme")) {
      this.themeStore.set(params.get("theme"))
    }
    if (
      (window.parent !== window || params.has("iframe")) &&
      this.themeStore.theme
    ) {
      this.$theme.update(this.themeStore.theme)
    }

    if (this.store.iframeOrigin) {
      this.store.setIframeOrigin(null)
    }
  },
}
</script>
