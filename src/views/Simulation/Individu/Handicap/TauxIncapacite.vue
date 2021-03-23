<template>
  <form @submit.prevent='onSubmit'>
    <legend>{{ role === 'demandeur' ? `Quel est votre taux d'incapacité` : `Quel est le taux d'incapacité de ${getLabel('nom')}` }} évalué par {{getLabel('possessif')}} <abbr title="Maison départementale des personnes handicapées">MDPH</abbr>&nbsp;?</legend>
    <template v-for="tauxIncapacite in tauxIncapaciteOptions">
      <input :id="tauxIncapacite.value"
             type="radio"
             name="tauxIncapacite"
             v-model="value"
             v-bind:value="tauxIncapacite.value"
             v-bind:key="'input-' + tauxIncapacite.value"
      />
      <label :for="tauxIncapacite.value" v-bind:key="'label-' + tauxIncapacite.value">
          {{ tauxIncapacite.label }}
      </label>
    </template>
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
