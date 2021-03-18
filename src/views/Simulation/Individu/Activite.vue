<template>
  <form @submit.prevent='onSubmit'>
    <h1>Êtes-vous&nbsp;?</h1>
    <label v-for="activite in ActiviteOptions" v-bind:key="activite.value">
    <input type="radio" name="activite" v-bind:value="activite.value" v-model="value"/>
    {{ activite.label }}
    </label>
    <Actions v-bind:onSubmit='onSubmit'/>
  </form>
</template>

<script>
import Actions from '@/components/Actions'
import Individu from '@/lib/Individu'
import { datesGenerator } from '../../../../backend/lib/mes-aides'

export default {
  name: 'SimulationActivite',
  components: {
    Actions,
  },
  data: function() {
    const id = this.$route.params.id
    const role = id.split('_')[0]
    const {individu} = Individu.get(this.$store.getters.peopleParentsFirst, role, this.$route.params.id, this.$store.state.dates)
    const value = individu.activite
    let situation = this.$store.state.situation
    let ActiviteOptions = [
      {
        value: 'actif',
        label: 'En activité'
      },
      {
        value: 'chomeur',
        label: 'Inscrit·e comme demandeur d’emploi'
      },
      {
        value: 'etudiant',
        label: 'En formation'
      },
      {
        value: 'retraite',
        label: 'Retraité·e'
      },
      {
        value: 'inactif',
        label: 'Autre'
      },
    ]
    const RETRAITE_INDEX = 3
    const age = Individu.age(individu, datesGenerator(situation.dateDeValeur).today.value);
    if (age < 30) {
      ActiviteOptions.splice(RETRAITE_INDEX, 1)
    }
    return {
      individu,
      id,
      value,
      ActiviteOptions
    }
  },
  methods: {
    onSubmit: function() {
      this.individu.activite = this.value
      this.$store.dispatch('updateIndividu', this.individu)
      this.$push()
    }
  }
}
</script>
