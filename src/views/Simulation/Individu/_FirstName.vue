<template>
  <form @submit.prevent='onSubmit'>
    <label for="_firstName">
      <h1>Quel est le prénom de votre enfant ?
      <span>il servira uniquement à vous faciliter la saisie par la suite</span></h1>
    </label>
    <input type="text" id="_firstName" v-model="value">
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
  mixins: [createIndividuMixin('_firstName')],
}
</script>
