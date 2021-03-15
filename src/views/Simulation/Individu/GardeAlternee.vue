<template>
  <form @submit.prevent='onSubmit'>
    <YesNoQuestion v-model="value">
      <h1>Enfant en garde alternée&nbsp;?</h1>
    </YesNoQuestion>
    <Actions v-bind:onSubmit='onSubmit'/>
  </form>
</template>

<script>
import Actions from '@/components/Actions'
import YesNoQuestion from '@/components/YesNoQuestion'
import Individu from '@/lib/Individu'

export default {
  name: 'SimulationIndividuGardeAlternee',
  components: {
    Actions,
    YesNoQuestion
  },
  data: function() {
    const id = this.$route.params.id
    const role = id.split('_')[0]
    const {individu} = Individu.get(this.$store.getters.peopleParentsFirst, role, this.$route.params.id, this.$store.state.dates)
    const value = individu.garde_alternee
    return {
      individu,
      id,
      value,
    }
  },
  methods: {
    onSubmit: function() {
      this.individu.garde_alternee = this.value
      this.$store.dispatch('updateIndividu', this.individu)
      this.$push()
    }
  }
}
</script>
