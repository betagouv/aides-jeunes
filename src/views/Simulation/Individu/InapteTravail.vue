<template>
  <form @submit.prevent="onSubmit">
    <YesNoQuestion v-model="value">
      {{ getLabel("être") | capitalize }} reconnu·e inapte au travail ?
      <EnSavoirPlus />
    </YesNoQuestion>
    <Actions v-bind:onSubmit="onSubmit" />
  </form>
</template>

<script>
import Actions from "@/components/Actions"
import YesNoQuestion from "@/components/YesNoQuestion"
import { createIndividuMixin } from "@/mixins/IndividuMixin"
import EnSavoirPlus from "@/components/EnSavoirPlus"

export default {
  name: "SimulationIndividuInapteTravail",
  components: {
    Actions,
    YesNoQuestion,
    EnSavoirPlus,
  },
  mixins: [createIndividuMixin("inapte_travail")],
}
</script>
