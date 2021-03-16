<template>
  <form @submit.prevent='onSubmit'>
    <h1>À quel échelon {{ role == 'demandeur' ? 'êtes-vous' : 'est-il/elle' }} boursier ?</h1>
    <input id="echelon-bourse" v-model="echelon_bourse" type="range" min="-1" max="7">
    {{ echelon_bourse == -1 ? 'Non boursier': 'Boursier échelon ' + echelon_bourse }}
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
