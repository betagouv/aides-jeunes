<template>
  <RessourceTypes :individu="individu" />
</template>

<script>
import RessourceTypes from "@/components/ressource/types.vue"
import * as individu from "@/../lib/individu"

export default {
  name: "RessourcesTypes",
  components: {
    RessourceTypes,
  },
  computed: {
    individu: function () {
      const id = this.$route.params.id
      const role = id.split("_")[0]
      const { individuProperties } = individu.Individu.get(
        this.$store.getters.peopleParentsFirst,
        role,
        this.$route.params.id,
        this.$store.state.dates
      )
      return individuProperties
    },
  },
}
</script>
