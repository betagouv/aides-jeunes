<template>
  <form @submit.prevent='onSubmit'>
    <h1>Avez-vous besoin d’une aide à la personne&nbsp;?</h1>
    <label v-for="gir in GIROptions" v-bind:key="gir.value">
    <input type="radio" name="gir" v-bind:value="gir.value" v-model="value"/>
    {{ gir.label }}
    </label>
    <Actions v-bind:onSubmit='onSubmit'/>
  </form>
</template>

<script>
import Actions from '@/components/Actions'
import Individu from '@/lib/Individu'

const GIROptions = [
    {
        value: 'gir_6',
        label: 'Jamais',
    },
    {
        value: 'gir_5',
        label: 'Ponctuellement',
    },
    {
        value: 'gir_1',
        label: 'Régulièrement'
    }
]

export default {
  name: 'SimulationIndividuGir',
  components: {
    Actions,
  },
  data: function() {
    const id = this.$route.params.id
    const role = id.split('_')[0]
    const { individu } = Individu.get(this.$store.getters.peopleParentsFirst, role, this.$route.params.id, this.$store.state.dates)
    const value = individu.gir
    return {
      individu,
      id,
      role,
      value,
      GIROptions
    }
  },
  methods: {
    onSubmit: function() {
      this.individu.gir = this.value
      this.$store.dispatch('updateIndividu', this.individu)
      this.$push()
    }
  }
}
</script>
