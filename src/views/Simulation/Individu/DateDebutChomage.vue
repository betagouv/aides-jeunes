<template>
  <form @submit.prevent='onSubmit'>
    <label>
      <h1>{{ role === 'demandeur' ?
        `Quelle est la date de votre debut de chômage ?` :
        `Quelle est la date de de debut de chômage de ${individu._firstName} &nbsp;?`}}</h1>
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
