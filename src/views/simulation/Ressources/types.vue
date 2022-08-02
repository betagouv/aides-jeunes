<template>
  <RessourceTypes :individu="individu" />
</template>

<script>
import RessourceTypes from "@/components/ressource/types"
import Individu from "../../../../lib/individu"

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
