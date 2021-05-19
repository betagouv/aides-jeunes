<template>
  <form @submit.prevent="onSubmit">
    <h1
      >Quelle est la valeur de {{ property }} pour
      {{ subject._firstName || subject.id }}&nbsp;?</h1
    >
    <Actions v-bind:onSubmit="onSubmit" />
  </form>
</template>

<script>
import Actions from "@/components/Actions"
import Individu from "@/lib/Individu"

export default {
  name: "SimulationIndividuProperty",
  components: {
    Actions,
  },
  computed: {
    property: function () {
      return this.$route.params.property
    },
    subject: function () {
      const id = this.$route.params.id
      const role = id.split("_")[0]
      if (this.$route.path.match(/individu/)) {
        const { individu } = Individu.get(
          this.$store.getters.peopleParentsFirst,
          role,
          this.$route.params.id,
          this.$store.state.dates
        )
        return individu
      } else {
        return {
          id,
        }
      }
    },
  },
  methods: {
    onSubmit: function () {
      this.$push()
    },
  },
}
</script>
