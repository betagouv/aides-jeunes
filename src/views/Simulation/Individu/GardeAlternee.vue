<template>
  <form @submit.prevent="onSubmit">
    <YesNoQuestion v-model="value">
      {{ getLabel("être") | capitalize }} en garde alternée&nbsp;?
    </YesNoQuestion>
    <Actions v-bind:onSubmit="onSubmit" />
  </form>
</template>

<script>
import Actions from "@/components/Actions"
import YesNoQuestion from "@/components/YesNoQuestion"
import { createIndividuMixin } from "@/mixins/IndividuMixin"

export default {
  name: "SimulationIndividuGardeAlternee",
  components: {
    Actions,
    YesNoQuestion,
  },
  mixins: [createIndividuMixin("garde_alternee")],
}
</script>
