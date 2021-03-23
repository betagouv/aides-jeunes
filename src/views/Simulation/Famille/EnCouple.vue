<template>
  <form @submit.prevent='onSubmit'>
    <fieldset>
      <legend><h1>Vivez-vous seul·e ou en couple ?</h1></legend>
      <label><input type="radio" v-bind:value="false" name="en_couple" v-model="value">Je vis seul·e</label>
      <label><input type="radio" v-bind:value="true" name="en_couple" v-model="value">Je vis en couple</label>
    </fieldset>
    <Actions v-bind:onSubmit='onSubmit'/>
  </form>
</template>

<script>
import Actions from '@/components/Actions'
import Individu from '@/lib/Individu'

export default {
  name: 'SimulationFamilleEnCouple',
  components: {
    Actions,
  },
  data: function() {
    const famille = this.$store.state.situation.famille
    const value = famille.en_couple
    return {
      famille,
      value,
    }
  },
  methods: {
    onSubmit: function() {
      if (this.value === undefined) {
        this.$store.dispatch('updateError', 'Ce champ est obligatoire.')
        return
      }
      this.famille.en_couple = this.value
      this.$store.dispatch('updateFamille', this.famille)

      if (this.value) {
        const { individu } = Individu.get(this.$store.getters.peopleParentsFirst, 'conjoint', 'conjoint', this.$store.state.dates)
        this.$store.dispatch('updateIndividu', individu)
      } else {
        this.$store.dispatch('removeConjoint')
      }
      this.$push()
    }
  }
}
</script>
