<template>
  <component v-bind:is="layout">
    <BandeauDemo></BandeauDemo>
    <router-view />
  </component>
</template>

<script>
import variation from "@/variations"
import iFrameLayout from "@/components/iFrameLayout.vue"
import BandeauDemo from "@/components/BandeauDemo"

const BaseLayout = variation.BaseLayout

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
