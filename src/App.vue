<template>
  <component v-bind:is="layout">
    <router-view/>
  </component>
</template>

<script>

import BaseLayout from '@/components/BaseLayout.vue'
import iFrameLayout from '@/components/iFrameLayout.vue'

export default {
  name: 'app',
  components: {
    BaseLayout,
    iFrameLayout,
  },
  computed: {
    layout: function() {
      return this.$store.state.inIframe ? "iFrameLayout" : "BaseLayout"
    }
  }
}
</script>

<style lang="scss">
</style>
