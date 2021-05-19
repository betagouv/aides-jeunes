<template>
  <form @submit.prevent="onSubmit">
    <YesNoQuestion v-model="value">
      Actuellement bénéficiez-vous d'une bourse du lycée&nbsp;?
    </YesNoQuestion>
    <Actions v-bind:onSubmit="onSubmit" />
  </form>
</template>

<script>
import Actions from "@/components/Actions"
import YesNoQuestion from "@/components/YesNoQuestion"
import { createIndividuMixin } from "@/mixins/IndividuMixin"

export default {
  name: "SimulationIndividuAideMobiliteParcoursupBoursierLycee",
  components: {
    Actions,
    YesNoQuestion,
  },
  mixins: [createIndividuMixin("aide_mobilite_parcoursup_boursier_lycee")],
}
</script>
