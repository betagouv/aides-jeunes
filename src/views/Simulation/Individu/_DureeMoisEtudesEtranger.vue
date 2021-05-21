<template>
  <form @submit.prevent="onSubmit">
    <fieldset>
      <legend
        ><h2 class="aj-question"
          >Quelle est la durée en mois de votre programme d'échanges ou de votre
          stage à l'international ?</h2
        ></legend
      >
      <label>
        <input min="0" type="number" v-select-on-click v-model.number="value" />
      </label>
    </fieldset>
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

<style scoped lang="css"></style>
