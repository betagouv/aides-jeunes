<template>
  <form @submit.prevent='onSubmit'>
    <YesNoQuestion v-model="value">
      <h1>Enfant à charge&nbsp;?</h1>
    </YesNoQuestion>
    <Actions v-bind:onSubmit='onSubmit'/>
  </form>
</template>

<script>
import Actions from '@/components/Actions'
import YesNoQuestion from '@/components/YesNoQuestion'
import { createIndividuMixin } from '@/mixins/IndividuMixin'

export default {
  name: 'SimulationIndividuEnfantACharge',
  components: {
    Actions,
    YesNoQuestion
  },
  mixins:[createIndividuMixin('enfant_a_charge')],
}
</script>
