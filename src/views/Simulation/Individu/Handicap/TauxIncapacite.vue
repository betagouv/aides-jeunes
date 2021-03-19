<template>
  <form @submit.prevent='onSubmit'>
    <h1>{{ role === 'demandeur' ? `Quel est votre taux d'incapacité` : `Quel est le taux d'incapacité de ${getLabel('nom')}` }} évalué par {{getLabel('possessif')}} <abbr title="Maison départementale des personnes handicapées">MDPH</abbr>&nbsp;?</h1>
    <label v-for="tauxIncapacite in tauxIncapaciteOptions" v-bind:key="tauxIncapacite.value">
      <input type="radio"
          name="tauxIncapacite"
          v-model="value"
          v-bind:value="tauxIncapacite.value"
          />
          {{ tauxIncapacite.label }}
    </label>
    <Actions v-bind:onSubmit='onSubmit'/>
  </form>
</template>

<script>
import Actions from '@/components/Actions'
import { createIndividuMixin } from '@/mixins/IndividuMixin'

const tauxIncapaciteOptions = [
  {
    value: 0.3,
    label: 'Moins de 50%'
  },
  {
    value: 0.7,
    label: 'Entre 50% et 80%'
  },
  {
    value: 0.9,
    label: 'Plus de 80%'
  }
]

export default {
  name: 'SimulationIndividuTauxIncapacite',
  components: {
    Actions,
  },
  mixins: [createIndividuMixin('taux_incapacite')], 
  data: function() {
    return {
      tauxIncapaciteOptions
    }
  },
}
</script>
