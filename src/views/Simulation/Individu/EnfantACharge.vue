<template>
  <form @submit.prevent='onSubmit'>
    <YesNoQuestion v-model="value">
      <h1>{{ role === 'demandeur' ? `Figurez-vous sur la dernière déclaration d'impôts de vos parents` :
        `${getLabel('nom')} figure-t-il/elle sur votre dernière déclaration d'impôts sur le revenu` | capitalize }}&nbsp;?</h1>
    </YesNoQuestion>
    <Actions v-bind:onSubmit='onSubmit'/>
  </form>
</template>

<script>
import Actions from '@/components/Actions'
import YesNoQuestion from '@/components/YesNoQuestion'
import Individu from '@/lib/Individu'
import { createIndividuMixin } from '@/mixins/IndividuMixin'

export default {
  name: 'SimulationIndividuEnfantACharge',
  components: {
    Actions,
    YesNoQuestion
  },
  mixins: [createIndividuMixin('enfant_a_charge')],
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
      if (this.requiredValueMissing()) {
          return
      }
      this.individu['enfant_a_charge'][this.$store.state.dates.thisYear.id] = this.value
      this.$store.dispatch('updateIndividu', this.individu)
      this.$push()
    },
  }
}
</script>
