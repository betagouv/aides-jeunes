<template>
  <form @submit.prevent='onSubmit'>
    <YesNoQuestion v-model="value">
      {{ getLabel('être') | capitalize }} boursier&nbsp;?
    </YesNoQuestion>
    <Actions v-bind:onSubmit='onSubmit'/>
  </form>
</template>

<script>
import Actions from '@/components/Actions'
import YesNoQuestion from '@/components/YesNoQuestion'
import { createIndividuMixin } from '@/mixins/IndividuMixin'

export default {
  name: 'SimulationIndividuBoursier',
  components: {
    Actions,
    YesNoQuestion
  },
  mixins: [createIndividuMixin('boursier')],
}
</script>
