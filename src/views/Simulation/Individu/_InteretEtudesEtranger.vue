<template>
  <form @submit.prevent="onSubmit">
    <YesNoQuestion v-model="value">
      Prévoyez-vous de réaliser une formation supérieure à l'étranger dans le
      cadre d'un programme d'échanges ou d'effectuer un stage international ?
    </YesNoQuestion>
    <Actions v-bind:onSubmit="onSubmit" />
  </form>
</template>

<script>
import Actions from "@/components/Actions"
import YesNoQuestion from "@/components/YesNoQuestion"
import { createIndividuMixin } from "@/mixins/IndividuMixin"

export default {
  name: "SimulationIndividuInteretEtudesEtranger",
  components: {
    Actions,
    YesNoQuestion,
  },
  mixins: [createIndividuMixin("_interetEtudesEtranger")],
}
</script>
