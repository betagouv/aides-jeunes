<template>
  <form @submit.prevent='onSubmit'>
    <fieldset>
    <legend>
    <h2 class="aj-question">{{ role === 'demandeur' ? `Quel est votre taux d'incapacité` : `Quel est le taux d'incapacité ${getLabel('particule')}${getLabel('nom')}` }} évalué par {{getLabel('possessive')}} <abbr title="Maison départementale des personnes handicapées">MDPH</abbr>&nbsp;?</h2>
    </legend>
    <div class="aj-selection-wrapper" v-for="tauxIncapacite in tauxIncapaciteOptions" v-bind:key="tauxIncapacite.value">
      <input :id="tauxIncapacite.value"
             type="radio"
             name="tauxIncapacite"
             v-model="value"
             v-bind:value="tauxIncapacite.value"
      />
      <label :for="tauxIncapacite.value">
          {{ tauxIncapacite.label }}
      </label>
    </div>
    </fieldset>
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
