<template>
  <form @submit.prevent='onSubmit'>
    <label class="form__group">
      Quel est le montant du revenu fiscal de référence de vos parents&nbsp;?
      <input type="number" v-select-on-click v-model.number="value">
    </label>
    <Actions v-bind:onSubmit='onSubmit'/>
  </form>
</template> 

    <script>
import Actions from '@/components/Actions'
import { createIndividuMixin } from '@/mixins/IndividuMixin'

export default {
  name: 'SimulationIndividuBourseCriteresSociauxBaseRessources',
  components: {
    Actions,
  },
  mixins: [createIndividuMixin('bourse_criteres_sociaux_base_ressource')],
}
</script>
