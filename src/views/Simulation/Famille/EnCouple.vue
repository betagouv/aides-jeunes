<template>
  <form @submit.prevent='onSubmit'>
    <fieldset>
      <legend><h2 class="aj-question">Vivez-vous seul·e ou en couple ?</h2></legend>
      <div class="aj-selection-wrapper">
        <input id="seul" type="radio" v-bind:value="false" name="en_couple" v-model="value">
        <label for="seul">Je vis seul·e</label>
      </div>
      <div class="aj-selection-wrapper">
        <input id="en-couple" type="radio" v-bind:value="true" name="en_couple" v-model="value">
        <label for="en-couple">Je vis en couple</label>
      </div>
    </fieldset>
    <Actions v-bind:onSubmit='onSubmit'/>
  </form>
</template>

<script>
import Actions from '@/components/Actions'
import Individu from '@/lib/Individu'
import { autoSubmitMixin } from '@/mixins/AutoSubmit'

export default {
  name: 'SimulationFamilleEnCouple',
  components: {
    Actions,
  },
  mixins: [autoSubmitMixin('value')],
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
