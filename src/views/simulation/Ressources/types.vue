<template>
  <RessourceTypes :individu="individu" />
</template>

<script lang="ts">
import RessourceTypes from "@/components/ressource/types.vue"
import IndividuMethods from "@lib/individu.js"
import { useStore } from "@/stores/index.js"

export default {
  name: "RessourcesTypes",
  components: {
    RessourceTypes,
  },
  setup() {
    return { store: useStore() }
  },
  computed: {
    individu() {
      const id = this.$route.params.id
      const role = id.split("_")[0]
      const { individu } = IndividuMethods.get(
        this.store.peopleParentsFirst,
        role,
        this.$route.params.id
      )
      return individu
    },
  },
}
</script>
