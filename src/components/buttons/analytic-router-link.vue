<template>
  <router-link :to="{}" @click="handleClick"> Montant inattendu ? </router-link>
</template>

<script>
import { useStore } from "@/stores/index.ts"

export default {
  name: "AnalyticRouterLink",
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
    handleClick() {
      this.droits, this.name, this.action
    },
  },
}
</script>
