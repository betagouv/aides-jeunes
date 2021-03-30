<template>
  <form @submit.prevent='onSubmit'>
    <YesNoQuestion v-model="value">
      Actuellement bénéficiez-vous d'une bourse du lycée&nbsp;?
    </YesNoQuestion>
    <Actions v-bind:onSubmit='onSubmit'/>
  </form>
</template>

<script>
import Actions from '@/components/Actions'
import YesNoQuestion from '@/components/YesNoQuestion'
import { createFamilleMixin } from '@/mixins/FamilleMixin'

export default {
  name: 'SimulationFamilleBourseLycee',
  components: {
    Actions,
    YesNoQuestion
  },
  mixins: [createFamilleMixin('bourse_lycee')],
}
</script>
