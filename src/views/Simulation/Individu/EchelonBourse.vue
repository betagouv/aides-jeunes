<template>
  <form @submit.prevent='onSubmit'>
      <fieldset>
        <legend><h1>À quel échelon {{ getLabel('être') }} boursier ?</h1></legend>
        <label>
          <input id="echelon-bourse" v-model="value" type="range" min="-1" max="7">
          {{ value == -1 ? 'Non boursier': 'Boursier échelon ' + value }}
        </label>
        <Actions v-bind:onSubmit='onSubmit'/>
      </fieldset>
  </form>
</template>

<script>
import Actions from '@/components/Actions'
import { createIndividuMixin } from '@/mixins/IndividuMixin'

export default {
  name: 'SimulationIndividuEchelonBourse',
  components: {
    Actions,
  },
  mixins: [createIndividuMixin('echelon_bourse')],
}
</script>
