<template>
  <component :is="layout" :data-name="variation.name">
    <BandeauDemo />
    <router-view />
  </component>
</template>

<script>
import variation from "@/variations"
import BandeauDemo from "@/components/bandeau-demo"
import iFrameLayout from "@/components/iframe-layout.vue"

const BaseLayout = variation.BaseLayout

export default {
  name: "App",
  components: {
    BandeauDemo,
    BaseLayout,
    iFrameLayout,
  },
  data: function () {
    return {
      variation,
    }
  },
  computed: {
    layout: function () {
      return this.$store.state.inIframe ? "iFrameLayout" : "BaseLayout"
    },
  },
}
</script>

<style lang="scss"></style>
