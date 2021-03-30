<template>
  <form @submit.prevent='onSubmit'>
    <fieldset>
      <legend><h1>Combien d'enfants (vous y compris) sont à la charge de vos parents&nbsp;?</h1></legend>
      <label>
        <input min="1" type="number" v-select-on-click v-model.number="value">
      </label>
    </fieldset>
    <Actions v-bind:onSubmit='onSubmit'/>
  </form>
</template>
<script>
import Actions from '@/components/Actions'
import { createFamilleMixin } from '@/mixins/FamilleMixin'

export default {
  name: 'SimulationIndividuBourseCriteresSociauxNombreEnfantsACharge',
  components: {
    Actions,
  },
  mixins: [
    createFamilleMixin({fields: [{name: 'bourse_criteres_sociaux_nombre_enfants_a_charge'}], manualValidation: true})
  ],
}
</script>
