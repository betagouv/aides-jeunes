<template>
  <form @submit.prevent="onSubmit">
    <fieldset>
      <legend
        ><h1 class="aj-question"
          >Et combien (vous y compris) font des études supérieures&nbsp;?</h1
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
import Actions from "@/components/Actions"
import { createFamilleMixin } from "@/mixins/FamilleMixin"

export default {
  name: "SimulationIndividuBourseCriteresSociauxNombreEnfantsAChargeDansEnseignementSuperieure",
  components: {
    Actions,
  },
  mixins: [
    createFamilleMixin(
      "bourse_criteres_sociaux_nombre_enfants_a_charge_dans_enseignement_superieur"
    ),
  ],
}
</script>
