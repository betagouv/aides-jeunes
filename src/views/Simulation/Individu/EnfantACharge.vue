<template>
  <form @submit.prevent='onSubmit'>
    <YesNoQuestion v-model="value">
      <h1>{{ role === 'demandeur' ? `Figurez vous sur la dernière déclarion d'impôts de vos parents ?` : `Figure-t-il/elle sur votre dernière déclaration d'impôt sur le revenu&nbsp;?`}}</h1>    </YesNoQuestion>
    <Actions v-bind:onSubmit='onSubmit'/>
  </form>
</template>

<script>
import Actions from '@/components/Actions'
import YesNoQuestion from '@/components/YesNoQuestion'
import Individu from '@/lib/Individu'

export default {
  name: 'SimulationIndividuEnfantACharge',
  components: {
    Actions,
    YesNoQuestion
  },
  data: function() {
    const id = this.$route.params.id
    const role = id.split('_')[0]
    const { individu } = Individu.get(this.$store.getters.peopleParentsFirst, role, this.$route.params.id, this.$store.state.dates)
    const value = individu['enfant_a_charge'][this.$store.state.dates.thisYear.id]
    return {
        individu,
        id,
        value,
        role
    }
  },
  methods: {
    onSubmit: function() {
        this.individu['enfant_a_charge'][this.$store.state.dates.thisYear.id] = this.value
        this.$store.dispatch('updateIndividu', this.individu)
        this.$push()
    },
  }
}
</script>
