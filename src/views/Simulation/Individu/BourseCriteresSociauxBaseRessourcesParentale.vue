<template>
  <form @submit.prevent='onSubmit'>
    <fieldset>
        <legend><h2>Quel est le montant du revenu fiscal de référence de vos parents&nbsp;?</h2></legend>
      <label>
        <input type="number" v-select-on-click v-model.number="value">
      </label>
    </fieldset>
    <Actions v-bind:onSubmit='onSubmit'/>
  </form>
</template> 

    <script>
import Actions from '@/components/Actions'
import { createIndividuMixin } from '@/mixins/IndividuMixin'

export default {
  name: 'SimulationIndividuBourseCriteresSociauxBaseRessourcesParentale',
  components: {
    Actions,
  },
  mixins: [createIndividuMixin({ fieldName: 'bourse_criteres_sociaux_base_ressources_parentale', manualValidation: true})],
}
</script>
