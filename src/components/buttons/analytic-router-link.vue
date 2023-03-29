<template>
  <router-link :to="to" @click="handleClick">
    <slot />
  </router-link>
</template>

<script>
import { useStore } from "@/stores/index.ts"
import StatisticsMixin from "@/mixins/statistics.ts"

export default {
  name: "AnalyticRouterLink",
  mixins: [StatisticsMixin],
  props: {
    analytics: {
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
      this.sendEventsToRecorder(
        this.droits,
        this.analytics.action,
        this.analytics.name
      )
      this.sendEventToMatomo(
        this.analytics.category,
        this.analytics.action,
        this.analytics.name
      )
    },
  },
}
</script>
