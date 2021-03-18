<template>
  <form @submit.prevent='onSubmit'>
    <h1>Quel est le prénom de votre enfant ?
    <span>(il servira uniquement à vous faciliter la saisie par la suite)</span></h1>
    <input type="text" v-model="value">
    <p class="notification warning" v-if="error">
        Ce champ est obligatoire.
    </p>
    <Actions v-bind:onSubmit='onSubmit'/>
  </form>
</template>

<script>
import Actions from '@/components/Actions'
import { createIndividuMixin } from '@/mixins/IndividuMixin'

export default {
  name: 'SimulationIndividuFirstName',
  components: {
    Actions,
  },
  mixins: [createIndividuMixin('_firstName', true)],
}
</script>
