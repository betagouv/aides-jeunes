<template>
  <form @submit.prevent='onSubmit'>
    <label>
      <h1>Quelle est la date de naissance de {{id}}&nbsp;?</h1>
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
import Individu from '@/lib/Individu'

export default {
  name: 'SimulationIndividuDateNaissance',
  components: {
    Actions,
    InputDate,
  },
  data: function() {
    const id = this.$route.params.id
    const role = id.split('_')[0]
    const {individu} = Individu.get(this.$store.getters.peopleParentsFirst, role, this.$route.params.id, this.$store.state.dates)
    const date_naissance = individu.date_naissance
    return {
      individu,
      id,
      date_naissance,
      error: false,
    }
  },
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
  }
}
</script>
