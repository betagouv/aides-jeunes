<template>
  <router-link :to="to" @click="handleClick">
    <slot />
  </router-link>
</template>

<script>
import { useStore } from "@/stores/index.ts"
import analytics from "@/mixins/statistics.js"

export default {
  name: "AnalyticRouterLink",
  props: {
    analytics: {
      type: Object,
      name: String,
      category: String,
      action: String,
    },
    to: {
      type: [String, Object],
      required: true,
    },
  },
  setup() {
    return {
      store: useStore(),
    }
  },
  computed: {
    droits() {
      const resultats =
        !this.store.calculs.dirty && this.store.calculs.resultats

      return resultats?.droitsEligibles
    },
  },
  methods: {
    handleClick() {
      analytics.methods.sendStatistics(
        this.droits,
        this.analytics.action,
        this.analytics.name
      )
      this.$matomo?.trackEvent(
        this.analytics.category,
        this.analytics.action,
        this.analytics.name
      )
    },
  },
}
</script>
