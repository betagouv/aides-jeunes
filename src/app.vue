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
  computed: {
    layout: function () {
      return this.store.inIframe ? "iFrameLayout" : "BaseLayout"
    },
  },
  mounted() {
    this.store.migrateSituationIdToSimulationId()
  },
}
</script>
