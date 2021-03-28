<template>
  <form @submit.prevent='onSubmit'>
    <h2 class="aj-question">Quand {{getLabel('avoir')}} commencé à être au chômage&nbsp;?</h2>
    <InputDate required id="date_debut_chomage" v-model="value" />
    <Actions v-bind:onSubmit='onSubmit'/>
  </form >
</template>

<script>
import Actions from '@/components/Actions'
import InputDate from '@/components/InputDate'
import { createIndividuMixin } from '@/mixins/IndividuMixin'

export default {
  name: 'SimulationIndividuDateDebutChomage',
  components: {
    Actions,
    InputDate,
  },
  mixins: [createIndividuMixin({fieldName: 'date_debut_chomage', manualValidation: true })],
}
</script>
