<template>
  <form @submit.prevent="onSubmit">
    <div>
      <h2 class="aj-question">
        Combien de mois envisagez-vous de partir à l'étranger dans le cadre de
        vos études ?
      </h2>
      <label>
        <InputNumber min="0" v-model="value"></InputNumber>
      </label>
    </div>
    <Actions v-bind:onSubmit="onSubmit" />
  </form>
</template>

<script>
import { createIndividuMixin } from "@/mixins/IndividuMixin"
import Actions from "@/components/Actions"
import InputNumber from "@/components/InputNumber"

export default {
  name: "SimulationIndividuDureeMoisEtudesEtranger",
  components: {
    Actions,
    InputNumber,
  },
  mixins: [createIndividuMixin("_dureeMoisEtudesEtranger")],
}
</script>
