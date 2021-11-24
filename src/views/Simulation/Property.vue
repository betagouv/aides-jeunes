<template>
  <form @submit.prevent="onSubmit">
    <h1>
      Quelle est la valeur de {{ property
      }}{{ subproperty ? "/" + subproperty : "" }} pour
      {{ individu._firstName || individu.id }}&nbsp;?
    </h1>
    <Actions :on-submit="onSubmit" />
  </form>
</template>

<script>
import Actions from "@/components/Actions"
import Individu from "@/../lib/Individu"

export default {
  name: "SimulationIndividuProperty",
  components: {
    Actions,
  },
  computed: {
    property: function () {
      return this.$route.params.property
    },
    subproperty: function () {
      return this.$route.params.subproperty
    },
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
  methods: {
    onSubmit: function () {
      this.$push()
    },
  },
}
</script>
