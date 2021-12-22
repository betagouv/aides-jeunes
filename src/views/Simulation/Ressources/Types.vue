<template>
  <RessourceTypes :individu="individu" />
</template>

<script>
import RessourceTypes from "@/components/Ressource/Types"
import Individu from "@/../lib/Individu"

export default {
  name: "RessourcesTypes",
  components: {
    RessourceTypes,
  },
  computed: {
    individu: function () {
      const id = this.$route.params.id
      const role = id.split("_")[0]
      const { individu } = Individu.get(
        this.$store.getters.peopleParentsFirst,
        role,
        this.$route.params.id,
        this.$store.state.dates
      )
      return individu
    },
  },
}
</script>
