<template>
  <router-link :to="to" @click="handleClick">
    <slot> </slot>
  </router-link>
</template>

<script>
import { useStore } from "@/stores/index.ts"
import analytics from "@/mixins/statistics.js"

export default {
  name: "AnalyticRouterLink",
  props: {
    name: String,
    category: String,
    action: String,
    value: String,
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
      analytics.methods.sendStatistics(this.droits, this.action, this.name)
      this.$matomo?.trackEvent(this.category, this.action, this.name)
    },
  },
}
</script>
