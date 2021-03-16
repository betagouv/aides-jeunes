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
import { createIndividuMixin } from '@/mixins/IndividuMixin'

export default {
  name: 'SimulationIndividuHandicap',
  components: {
    Actions,
    YesNoQuestion
  },
  mixins: [createIndividuMixin('handicap')],
}
</script>
