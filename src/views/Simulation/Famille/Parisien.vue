<template>
  <form @submit.prevent="onSubmit">
    <YesNoQuestion v-model="value">
      Avez-vous habité Paris au moins 3 ans depuis {{ yearsAgo(5) }} ?
    </YesNoQuestion>
    <Actions v-bind:onSubmit="onSubmit" />
  </form>
</template>
<script>
import Actions from "@/components/Actions"
import YesNoQuestion from "@/components/YesNoQuestion"
import { createFamilleMixin } from "@/mixins/FamilleMixin"
import { yearsAgo } from "@/lib/Utils"

export default {
  name: "SimulationFamilleParisien",
  components: {
    Actions,
    YesNoQuestion,
  },
  mixins: [createFamilleMixin("parisien")],
  methods: {
    yearsAgo: function (years) {
      return yearsAgo(years, this.$store.state.situation.dateDeValeur)
    },
  },
}
</script>
