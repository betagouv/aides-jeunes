<template>
  <form @submit.prevent='onSubmit'>
    <label>
      <h1>Quand {{getLabel('avoir')}} commencé à être au chômage&nbsp;?</h1>
      <InputDate required id="date_debut_chomage" v-model="value" />
      <p class="notification warning" v-if="error">
        Ce champ est obligatoire.
      </p>
    </label>
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
  mixins: [createIndividuMixin('date_debut_chomage', true)], 
}
</script>
