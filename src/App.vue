<template>
  <component v-bind:is="layout">
    <BandeauDemo></BandeauDemo>
    <router-view />
  </component>
</template>

<script>
import BaseLayout from "@/components/BaseLayout.vue"
import iFrameLayout from "@/components/iFrameLayout.vue"
import BandeauDemo from "@/components/BandeauDemo"

export default {
  name: "app",
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
