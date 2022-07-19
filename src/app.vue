<template>
  <component :is="layout">
    <BandeauDemo />
    <router-view />
  </component>
</template>

<script>
import iFrameLayout from "@/components/iframe-layout.vue"
import BandeauDemo from "@/components/bandeau-demo"

import context from "@/context"
import { useStore } from "@/stores"
const BaseLayout = context.BaseLayout

export default {
  name: "App",
  components: {
    BandeauDemo,
    BaseLayout,
    iFrameLayout,
  },
  setup() {
    return {
      store: useStore(),
    }
  },
  computed: {
    layout: function () {
      return this.store.inIframe ? "iFrameLayout" : "BaseLayout"
    },
  },
}
</script>

<style lang="scss"></style>
