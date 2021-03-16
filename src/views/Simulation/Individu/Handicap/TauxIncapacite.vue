<template>
  <form @submit.prevent='onSubmit'>
    <h1>Quel est {{ role == 'demandeur' ? 'votre' : 'son' }} taux d'incapacité évalué par {{ role == 'demandeur' ? 'votre' : 'sa' }} <abbr title="Maison départementale des personnes handicapées">MDPH</abbr>&nbsp;?</h1>
    <legend>
      {{ role == 'demandeur' ? 'Votre' : 'Son' }} taux d'incapacité
      <span>
      évalué par <a target="_blank" rel="noopener" href="http://informations.handicap.fr/carte-france-mdph.php">votre <abbr title="Maison départementale des personnes handicapées">MDPH</abbr></a>.
      </span>
    </legend>
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
