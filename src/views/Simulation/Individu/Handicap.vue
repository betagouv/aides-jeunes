<template>
  <form @submit.prevent='onSubmit'>
    <YesNoQuestion v-model="value">
      <h1>{{ role === 'demandeur' ? 'Êtes-vous' : 'Est-il/Est-elle'}} en situation de handicap&nbsp;?</h1>
    </YesNoQuestion>
    <Actions v-bind:onSubmit='onSubmit'/>
  </form>
</template>

<script>
import Actions from '@/components/Actions'
import YesNoQuestion from '@/components/YesNoQuestion'
import Individu from '@/lib/Individu'

export default {
  name: 'SimulationIndividuHandicap',
  components: {
    Actions,
    YesNoQuestion
  },
  data: function() {
    const id = this.$route.params.id
    const role = id.split('_')[0]
    const {individu} = Individu.get(this.$store.getters.peopleParentsFirst, role, this.$route.params.id, this.$store.state.dates)
    const value = individu.handicap
    return {
      individu,
      id,
      value,
      role
    }
  },
  methods: {
    onSubmit: function() {
      this.individu.handicap = this.value
      this.$store.dispatch('updateIndividu', this.individu)
      this.$push()
    }
  }
}
</script>
