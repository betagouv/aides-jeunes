<template>
  <form @submit.prevent="onSubmit">
    <YesNoQuestion v-model="value">
      Prévoyez-vous de passer le permis de conduire ?
    </YesNoQuestion>
    <Actions v-bind:onSubmit="onSubmit" />
  </form>
</template>

<script>
import Actions from "@/components/Actions"
import YesNoQuestion from "@/components/YesNoQuestion"
import { createIndividuMixin } from "@/mixins/IndividuMixin"

export default {
  name: "SimulationIndividuInteretPermisDeConduire",
  components: {
    Actions,
    YesNoQuestion,
  },
  mixins: [createIndividuMixin("_interetPermisDeConduire")],
}
</script>
