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
import { useIframeStore } from "@/stores/iframe.js"
import { useThemeStore } from "@/stores/theme.js"

const { Layout } = context

export default {
  name: "App",
  components: {
    BandeauDemo,
    iFrameLayout,
    Layout,
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
      return this.iframeStore.inIframe ? "iFrameLayout" : "Layout"
    },
  },
  mounted() {
    const params = new URLSearchParams(document.location.search.substring(1))
    if (params.has("iframe")) {
      this.iframeStore.setInIframe()
    }

    if (params.has("data-with-logo")) {
      this.iframeStore.setIframeHeaderCollapse(
        params.get("data-with-logo") !== "false"
      )
    }

    if (params.has("theme")) {
      this.themeStore.set(params.get("theme"))
    }

    if (
      (window.parent !== window || this.iframeStore.inIframe) &&
      this.themeStore.theme
    ) {
      this.$theme.update(this.themeStore.theme)
    }
  },
}
</script>
