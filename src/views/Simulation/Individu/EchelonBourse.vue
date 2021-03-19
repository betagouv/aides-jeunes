<template>
  <form @submit.prevent='onSubmit'>
    <h1>À quel échelon {{ getLabel('être') }} boursier ?</h1>
    <input id="echelon-bourse" v-model="value" type="range" min="-1" max="7">
    {{ value == -1 ? 'Non boursier': 'Boursier échelon ' + value }}
    <Actions v-bind:onSubmit='onSubmit'/>
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
