<template>
  <form @submit.prevent='onSubmit'>
    <YesNoQuestion v-bind:value="value">
      <h1>{{ getLabel('avoir') }}
        travaillé <abbr title="1825 jours (5 fois 365) couverts par un contrat de travail, en activité ou en congés.">au moins 5 ans</abbr> entre {{ yearsAgo(10) }}
        et {{ yearsAgo(0) }} ?</h1>
    </YesNoQuestion>
    <Actions v-bind:onSubmit='onSubmit'/>
  </form >
</template>

<script>
import moment from 'moment'

import Actions from '@/components/Actions'
import YesNoQuestion from '@/components/YesNoQuestion'
import { createIndividuMixin } from '@/mixins/IndividuMixin'

export default {
  name: 'SimulationIndividuAssPreconditionRemplie',
  components: {
    Actions,
    YesNoQuestion
  },
  mixins: [createIndividuMixin('ass_precondition_remplie')],
  methods: {
    yearsAgo: function(years) {
      let dt = moment(this.individu.date_debut_chomage)
      return this.individu.date_debut_chomage && dt.subtract(years, 'years').format('MMMM YYYY')
    }
  },
}
</script>
