<template>
  <RessourceTypes :individu="individu" />
</template>

<script>
import RessourceTypes from "@/components/ressource/types"
import Individu from "@lib/individu"
import { useStore } from "@/stores"

export default {
  name: "RessourcesTypes",
  components: {
    RessourceTypes,
  },
  setup() {
    return { store: useStore() }
  },
  computed: {
    individu: function () {
      const id = this.$route.params.id
      const role = id.split("_")[0]
      const { individu } = Individu.get(
        this.store.peopleParentsFirst,
        role,
        this.$route.params.id,
        this.store.dates
      )
      return individu
    },
  },
}
</script>
