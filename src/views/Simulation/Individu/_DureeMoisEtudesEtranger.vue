<template>
  <form @submit.prevent="onSubmit">
    <div>
      <h2 class="aj-question">
        Combien de mois envisagez-vous de partir à l'étranger dans le cadre de
        vos études ?
      </h2>
      <label>
        <input min="0" type="number" v-select-on-click v-model.number="value" />
      </label>
    </div>
    <Actions v-bind:onSubmit="onSubmit" />
  </form>
</template>

<script>
import { createIndividuMixin } from "@/mixins/IndividuMixin"
import Actions from "@/components/Actions"

export default {
  name: "SimulationIndividuDureeMoisEtudesEtranger",
  components: {
    Actions,
  },
  mixins: [createIndividuMixin("_dureeMoisEtudesEtranger")],
}
</script>
