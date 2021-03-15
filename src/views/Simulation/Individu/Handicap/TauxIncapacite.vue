<template>
  <form @submit.prevent='onSubmit'>
    <h1>Quel est {{ role == 'demandeur' ? 'votre' : 'son' }} taux d'incapacité évalué par votre MDPH.</h1>
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
import Individu from '@/lib/Individu'

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
  name: 'SimulationIndividuTauxHandicap',
  components: {
    Actions,
  },
  data: function() {
    const id = this.$route.params.id
    const role = id.split('_')[0]
    const { individu } = Individu.get(this.$store.getters.peopleParentsFirst, role, this.$route.params.id, this.$store.state.dates)
    const value = individu.taux_incapacite
    return {
      individu,
      id,
      role,
      value,
      tauxIncapaciteOptions
    }
  },
  methods: {
    onSubmit: function() {
      this.individu.taux_incapacite = this.value
      this.$store.dispatch('updateIndividu', this.individu)
      this.$push()
    }
  }
}
</script>
