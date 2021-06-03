<template>
  <form @submit.prevent="onSubmit">
    <fieldset>
      <legend
        ><h2 class="aj-question"
          >Combien d'enfants (vous y compris) sont à la charge de vos
          parents&nbsp;?</h2
        ></legend
      >
      <label>
        <input min="1" type="number" v-select-on-click v-model.number="value" />
      </label>
    </fieldset>
    <Actions v-bind:onSubmit="onSubmit" />
  </form>
</template>
<script>
import Actions from "@/components/Actions"
import { createFamilleMixin } from "@/mixins/FamilleMixin"

export default {
  name: "SimulationIndividuBourseCriteresSociauxNombreEnfantsACharge",
  components: {
    Actions,
  },
  mixins: [
    createFamilleMixin("bourse_criteres_sociaux_nombre_enfants_a_charge"),
  ],
}
</script>
