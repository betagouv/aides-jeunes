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
      this.famille.en_couple = this.value
      this.$store.dispatch('updateFamille', this.famille)
      this.$push()
    }
  }
}
</script>
