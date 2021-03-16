<template>
  <form @submit.prevent='onSubmit'>
    <h1>Quel est votre activité&nbsp;?</h1>
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

const ActiviteOptions = [
  {
      id: '_chomeur',
      label: 'Inscrit·e comme demandeur d’emploi'
  },
  {
      id: 'enceinte',
      label: 'Enceinte'
  },
  {
      id: 'etudiant',
      label: 'Étudiant·e, apprenti·e'
  },
  // {
  //     id: 'handicap',
  //     label: 'En situation de handicap'
  // },
  // {
  //     id: 'inapte_travail',
  //     label: 'Inapte au travail'
  // },
  {
    id: 'autre',
    label: 'Autre'
  },
  {
      id: '_retraite',
      label: 'Retraité·e'
  },
]

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
