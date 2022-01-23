<template>
  <component :is="layout">
    <BandeauDemo />
    <router-view />
  </component>
</template>

<script>
import iFrameLayout from "@/components/iframe-layout.vue"
import BandeauDemo from "@/components/bandeau-demo"

import variation from "@/variations"

const BaseLayout = variation.BaseLayout

export default {
  name: "App",
  components: {
    BandeauDemo,
    BaseLayout,
    iFrameLayout,
  },
  computed: {
    layout: function () {
      return this.$store.state.inIframe ? "iFrameLayout" : "BaseLayout"
    },
  },
}
</script>

<style lang="scss"></style>
