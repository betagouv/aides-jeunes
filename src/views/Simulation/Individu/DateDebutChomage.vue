<template>
  <form @submit.prevent='onSubmit'>
    <label>
      <h1>Quelle est la date de debut de chômage {{ individu._firstName ? 'de ' + individu._firstName : 'du ' + individu.id}}&nbsp;?</h1>
      <InputDate required id="date_debut_chomage" v-model="date_debut_chomage" />
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
  mixins: [createIndividuMixin('date_debut_chomage')], 
  data () {
    return {
      error: false
    }
  },
  methods: {
    onSubmit: function() {
      if (!this.date_debut_chomage) {
        this.error = true
        return
      }
      this.individu.date_debut_chomage = this.date_debut_chomage
      this.$store.dispatch('updateIndividu', this.individu)
      this.$push()
    }
  },
}
</script>
