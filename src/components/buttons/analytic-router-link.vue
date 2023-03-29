<template>
  <router-link @click="toto" :to="{}"> Montant inattendu ? </router-link>
</template>

<script>
import { trackMatomoEvent } from "../../../src/directives/analytics.js"
import sendStatistics from "../../../src/directives/analytics.js"
import { useStore } from "@/stores/index.ts"

export default {
  name: "AnalyticRouterLink",
  components: {
    sendStatistics,
    trackMatomoEvent,
  },
  props: {
    name: String,
    category: String,
    action: String,
    value: String,
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
    toto() {
      this.droits, this.name, this.action
    },
  },
}
</script>
