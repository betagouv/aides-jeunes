<template>
  <form @submit.prevent='onSubmit'>
    <YesNoQuestion v-model="value">
      {{ getLabel('être') | capitalize }} en situation de handicap&nbsp;? <EnSavoirPlus/>
    </YesNoQuestion>
    <Actions v-bind:onSubmit='onSubmit'/>
  </form>
</template>

<script>
import Actions from '@/components/Actions'
import YesNoQuestion from '@/components/YesNoQuestion'
import { createIndividuMixin } from '@/mixins/IndividuMixin'
import EnSavoirPlus from "@/components/EnSavoirPlus"

export default {
  name: 'SimulationIndividuHandicap',
  components: {
    EnSavoirPlus,
    Actions,
    YesNoQuestion
  },
  mixins: [createIndividuMixin('handicap')],
}
</script>
