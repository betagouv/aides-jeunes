<template>
  <form @submit.prevent='onSubmit'>
    <YesNoQuestion v-model="value">
      <h1>{{ getLabel('être') }} placé·e en structure spécialisée ou famille d'accueil ?</h1>
    </YesNoQuestion>
    <Actions v-bind:onSubmit='onSubmit'/>
  </form>
</template>

<script>
import Actions from '@/components/Actions'
import YesNoQuestion from '@/components/YesNoQuestion'
import { createIndividuMixin } from '@/mixins/IndividuMixin'

export default {
  name: 'SimulationIndividuEnfantPlace',
  components: {
    Actions,
    YesNoQuestion
  },
  mixins: [createIndividuMixin('enfant_place')],
}
</script>
