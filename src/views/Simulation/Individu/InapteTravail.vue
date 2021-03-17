<template>
  <form @submit.prevent='onSubmit'>
    <YesNoQuestion v-model="value">
      <h1>{{ role === 'demandeur' ? 'Êtes-vous' : 'Est-il' }} inapte au travail ?</h1>
    </YesNoQuestion>
    <Actions v-bind:onSubmit='onSubmit'/>
  </form>
</template>

<script>
import Actions from '@/components/Actions'
import YesNoQuestion from '@/components/YesNoQuestion'
import { createIndividuMixin } from '@/mixins/IndividuMixin'

export default {
  name: 'SimulationIndividuInapteTravail',
  components: {
    Actions,
    YesNoQuestion
  },
  mixins: [createIndividuMixin('inapte_travail')],
}
</script>
