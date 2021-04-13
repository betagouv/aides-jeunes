<template>
  <form @submit.prevent='onSubmit'>
    <label class="aj-question">Quel est le prénom de votre enfant ? Il servira uniquement à vous faciliter la saisie par la suite.</label>
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
  mixins: [createIndividuMixin({fieldName:'_firstName', manualValidation: true})],
  methods: {
    onSubmit: function() {
      if (this.value.length) {
        this.individu[this.fieldName] = this.value
        this.$store.dispatch('updateIndividu', this.individu)
      }
      this.$push()
    },
  }
}
</script>
