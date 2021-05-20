<template>
  <form @submit.prevent="onSubmit">
    <YesNoQuestion v-model="value">
      {{ getLabel("avoir") | capitalize }} travaillé
      <abbr
        title="ou 3 214 heures (2 fois 1 607) couvertes par un contrat de travail."
        >au moins 2 ans</abbr
      >
      depuis {{ yearsAgo(3) }}&nbsp;?
    </YesNoQuestion>
    <Actions v-bind:onSubmit="onSubmit" />
  </form>
</template>

<script>
import moment from "moment"

import Actions from "@/components/Actions"
import YesNoQuestion from "@/components/YesNoQuestion"
import { createIndividuMixin } from "@/mixins/IndividuMixin"

export default {
  name: "SimulationIndividuRsaJeuneConditionHeuresTravailRemplie",
  components: {
    Actions,
    YesNoQuestion,
  },
  mixins: [createIndividuMixin("rsa_jeune_condition_heures_travail_remplie")],
  methods: {
    yearsAgo: function (years) {
      let dt = moment(this.$store.state.dates.today.id)
      return dt.subtract(years, "years").format("MMMM YYYY")
    },
  },
}
</script>
