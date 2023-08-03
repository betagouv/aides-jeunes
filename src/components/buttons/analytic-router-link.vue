<template>
  <router-link :to="to" @click="handleClick">
    <slot />
  </router-link>
</template>

<script lang="ts">
import { useStore } from "@/stores/index.js"
import StatisticsMixin from "@/mixins/statistics.js"

export default {
  name: "AnalyticRouterLink",
  mixins: [StatisticsMixin],
  props: {
    analyticName: {
      type: String,
      required: true,
    },
    analyticAction: {
      type: String,
      required: true,
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
      this.sendBenefitsStatistics(
        this.droits,
        this.analyticAction,
        this.analyticName
      )
    },
  },
}
</script>
