<template>
  <form @submit.prevent='onSubmit'>
    <fieldset>
        <legend><h2 class="aj-question">Quel est le revenu brut global 2019 figurant sur l’avis fiscal 2020 de vos parents&nbsp;?</h2></legend>
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
  mixins: [createIndividuMixin('bourse_criteres_sociaux_base_ressources_parentale')],
}
</script>
