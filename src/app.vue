<template>
  <component :is="layout">
    <BandeauDemo />
    <router-view />
  </component>
</template>

<script>
import iFrameLayout from "@/components/iframe-layout.vue"
import BandeauDemo from "@/components/bandeau-demo.vue"

import context from "@/context/index.js"
import { persistDataOnSessionStorage, useStore } from "@/stores/index.ts"
const BaseLayout = context.BaseLayout

export default {
  name: "App",
  components: {
    BandeauDemo,
    BaseLayout,
    iFrameLayout,
  },
  setup() {
    const store = useStore()
    store.$onAction(persistDataOnSessionStorage)
    store.initialize()
    store.setOpenFiscaParameters()
    return {
      store,
    }
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
      this.$theme.update(params.get("theme"))
    }
    if (this.store.iframeOrigin) {
      this.store.setIframeOrigin(null)
    }
  },
  computed: {
    layout: function () {
      return this.store.inIframe ? "iFrameLayout" : "BaseLayout"
    },
  },
}
</script>
