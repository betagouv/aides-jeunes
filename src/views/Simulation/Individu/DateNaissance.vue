<template>
  <form @submit.prevent='onSubmit'>
    <label>
      <h1>Quelle est la date de naissance de {{individu._firstName || individu.id}}&nbsp;?</h1>
      <InputDate required id="date_naissance" v-model="date_naissance" />
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
  name: 'SimulationIndividuDateNaissance',
  components: {
    Actions,
    InputDate,
  },
  mixins: [createIndividuMixin('date_naissance')],
  methods: {
    onSubmit: function() {
      if (!this.date_naissance) {
        this.error = true
        return
      }
      this.individu.date_naissance = this.date_naissance
      this.$store.dispatch('updateIndividu', this.individu)
      this.$push()
    }
  },
}
</script>
