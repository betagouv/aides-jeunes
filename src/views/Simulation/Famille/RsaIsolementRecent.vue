<template>
  <form @submit.prevent='onSubmit'>
    <fieldset>
      <legend><h1>Depuis combien de temps vivez-vous seul·e ?</h1></legend>
      <label><input type="radio" v-bind:value="false" v-model="value">Moins de 18 mois</label>
      <label><input type="radio" v-bind:value="true" v-model="value">Plus de 18 mois</label>
    </fieldset>
    <Actions v-bind:onSubmit='onSubmit'/>
  </form>
</template>

<script>
import Actions from '@/components/Actions'

export default {
  name: 'SimulationFamilleRsaIsolementRecent',
  components: {
    Actions,
  },
  data: function() {
    const famille = this.$store.state.situation.famille
    const value = famille.rsa_isolement_recent
    return {
      famille,
      value,
    }
  },
  methods: {
    onSubmit: function() {
      this.famille.rsa_isolement_recent = this.value
      this.$store.dispatch('updateFamille', this.famille)
      this.$push()
    }
  }
}
</script>
