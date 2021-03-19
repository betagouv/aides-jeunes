<template>
  <form @submit.prevent='onSubmit'>
    <YesNoQuestion v-model="value">
      <h1>{{ getLabel('être') | capitalize }} en garde alternée&nbsp;?</h1>
    </YesNoQuestion>
    <Actions v-bind:onSubmit='onSubmit'/>
  </form>
</template>

<script>
import Actions from '@/components/Actions'
import YesNoQuestion from '@/components/YesNoQuestion'
import { createIndividuMixin } from '@/mixins/IndividuMixin'

export default {
  name: 'SimulationIndividuGardeAlternee',
  components: {
    Actions,
    YesNoQuestion
  },
  mixins: [createIndividuMixin('garde_alterne')],
}
</script>
