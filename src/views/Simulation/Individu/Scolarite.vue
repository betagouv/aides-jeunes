<template>
  <form @submit.prevent='onSubmit'>
    <h1>Scolarité &nbsp;?</h1>
    <label v-for="scolarite in scolariteOptions" v-bind:key="scolarite.value">
    <input type="radio" name="scolarite" v-bind:value="scolarite.value" v-model="value"/>
    {{ scolarite.label }}
    </label>
    <Actions v-bind:onSubmit='onSubmit'/>
  </form>
</template>

<script>
import Actions from '@/components/Actions'
import Individu from '@/lib/Individu'

const scolariteOptions = [
  {
      value: 'inconnue',
      label: 'Aucun des deux'
  },
  {
      value: 'college',
      label: 'Au collège'
  },
  {
      value: 'lycee',
      label: 'Au lycée / En CAP / En CPA'
  }
]
export default {
  name: 'SimulationIndividuScolarite',
  components: {
    Actions,
  },
  data: function() {
    const id = this.$route.params.id
    const role = id.split('_')[0]
    const { individu } = Individu.get(this.$store.getters.peopleParentsFirst, role, this.$route.params.id, this.$store.state.dates)
    const value = individu.scolarite
    return {
      individu,
      id,
      role,
      value,
      scolariteOptions
    }
  },
  methods: {
    onSubmit: function() {
      this.individu.scolarite = this.value
      this.$store.dispatch('updateIndividu', this.individu)
      this.$push()
    }
  }
}
</script>
