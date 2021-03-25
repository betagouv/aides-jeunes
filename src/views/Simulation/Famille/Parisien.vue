
<template>
  <form @submit.prevent='onSubmit'>
    <fieldset>
        <YesNoQuestion v-model="value">
            <legend><h1>Avez-vous habité Paris au moins 3 ans depuis {{ yearsAgo(5) }} ?</h1></legend>
        </YesNoQuestion>
    </fieldset>
    <Actions v-bind:onSubmit='onSubmit'/>
  </form>
</template>
<script>
import moment from 'moment'

import Actions from '@/components/Actions'
import YesNoQuestion from '@/components/YesNoQuestion'
import { createFamilleMixin } from '@/mixins/FamilleMixin'

export default {
  name: 'SimulationFamilleParisien',
  components: {
    Actions,
    YesNoQuestion,
  },
  mixins: [
    createFamilleMixin('parisien')
  ],
  methods: {
    yearsAgo: function(years) {
      return moment(this.$store.state.situation.dateDeValeur).subtract(years, 'years').format('MMMM YYYY')
    },
  }
}
</script>
