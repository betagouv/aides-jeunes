<template>
  <form @submit.prevent='onSubmit'>
    <YesNoQuestion v-bind:value="ass_precondition_remplie">
        {{ individu._role == 'demandeur' ? 'Avez-vous' : 'A-t-il/elle' }}
        travaillé <abbr title="1825 jours (5 fois 365) couverts par un contrat de travail, en activité ou en congés.">au moins 5 ans</abbr> entre {{ yearsAgo(10) }}
        et {{ yearsAgo(0) }} ?
    </YesNoQuestion>
    <Actions v-bind:onSubmit='onSubmit'/>
  </form >
</template>

<script>
import moment from 'moment'

import Actions from '@/components/Actions'
import Individu from '@/lib/Individu'
import YesNoQuestion from '@/components/YesNoQuestion'

export default {
  name: 'SimulationIndividuAssPreconditionRemplie',
  components: {
    Actions,
    YesNoQuestion
  },
  data: function() {
    const id = this.$route.params.id
    const role = id.split('_')[0]
    const {individu} = Individu.get(this.$store.getters.peopleParentsFirst, role, this.$route.params.id, this.$store.state.dates)
    const ass_precondition_remplie = individu.ass_precondition_remplie
    return {
      individu,
      id,
      ass_precondition_remplie,
      error: false,
    }
  },
  methods: {
    onSubmit: function() {
      this.individu.ass_precondition_remplie = this.ass_precondition_remplie
      this.$store.dispatch('updateIndividu', this.individu)
      this.$push()
    },
    yearsAgo: function(years) {
      let dt = moment(this.individu.date_debut_chomage)
      return this.individu.date_debut_chomage && dt.subtract(years, 'years').format('MMMM YYYY')
    }
  }
}
</script>
