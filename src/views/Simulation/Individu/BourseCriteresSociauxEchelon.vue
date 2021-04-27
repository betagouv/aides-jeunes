<template>
  <form @submit.prevent='onSubmit'>
    <label for="bourse_criteres_sociaux_echelon" class="aj-question">À quel échelon {{ getLabel('être') }} boursier ?</label>
    <input id="bourse_criteres_sociaux_echelon" v-model="value" type="range" min="-1" max="7">
    {{ value == -1 ? 'Non boursier': 'Boursier échelon ' + value }}
    <Actions v-bind:onSubmit='onSubmit'/>
  </form>
</template>

<script>
import Actions from '@/components/Actions'
import { createIndividuMixin } from '@/mixins/IndividuMixin'

export default {
  name: 'SimulationIndividuBourseCriteresSociauxEchelon',
  components: {
    Actions,
  },
  mixins: [createIndividuMixin({fieldName: 'bourse_criteres_sociaux_echelon', manualValidation: true})],
}
</script>
