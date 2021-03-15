<template>
  <form @submit.prevent='onSubmit'>
    <h1>Votre relation &nbsp;?</h1>
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
import Individu from '@/lib/Individu'

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
  data: function() {
    const id = this.$route.params.id
    const role = id.split('_')[0]
    const { individu } = Individu.get(this.$store.getters.peopleParentsFirst, role, this.$route.params.id, this.$store.state.dates)
    const value = individu.statut_marital
    return {
      individu,
      id,
      role,
      value,
      situationsFamiliales
    }
  },
  methods: {
    onSubmit: function() {
      this.individu.statut_marital = this.value
      this.$store.dispatch('updateIndividu', this.individu)
      this.$push()
    }
  }
}
</script>
