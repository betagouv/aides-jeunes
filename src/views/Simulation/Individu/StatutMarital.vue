<template>
  <form @submit.prevent='onSubmit'>
    <label class="aj-question">Quelle est votre relation avec votre conjoint&nbsp;?</label>
      <select v-model="value">
        <option v-for="situationFamiliale in situationsFamiliales" v-bind:value="situationFamiliale.value" v-bind:key="situationFamiliale.value">
          {{situationFamiliale.label}}
        </option>
      </select>
    <Actions v-bind:onSubmit='onSubmit'/>
  </form>
</template>

<script>
import Actions from '@/components/Actions'
import { createIndividuMixin } from '@/mixins/IndividuMixin'

const situationsFamiliales = [
  {
      value: 'marie',  // Enum value 1 in OpenFisca
      label: 'Marié·e',
  },
  {
      value: 'pacse',  // Enum value 5 in OpenFisca
      label: 'Pacsé·e',
  },
  {
      value: 'celibataire',  // Enum value 2 in OpenFisca
      label: 'En union libre',
  }
]

export default {
  name: 'SimulationIndividuStatutMarital',
  components: {
    Actions,
  },
  mixins: [createIndividuMixin('statut_marital')],
  data: function() {
    return {
      situationsFamiliales
    }
  },
}
</script>
