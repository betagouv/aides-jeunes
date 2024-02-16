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
import { useIframeStore } from "@/stores/iframe.js"

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
    const iframeStore = useIframeStore()
    const themeStore = useThemeStore()
    return {
      iframeStore,
      themeStore,
    }
  },
  computed: {
    layout: function () {
      return this.iframeStore.inIframe
        ? "iFrameLayout"
        : (process.env.VITE_LAYOUT as string)
    },
  },
  mounted() {
    const params = new URLSearchParams(document.location.search.substring(1))
    if (params.has("iframe")) {
      this.iframeStore.setIframeOrigin(null)
    }

    if (params.has("data-with-logo")) {
      this.iframeStore.setIframeHeaderCollapse(params.get("data-with-logo"))
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

    if (this.iframeStore.iframeOrigin) {
      this.iframeStore.setIframeOrigin(null)
    }
  },
}
</script>
