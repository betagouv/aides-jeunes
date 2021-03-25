<template>
  <form @submit.prevent='onSubmit'>
    <fieldset>
      <legend><h1>Combien d'enfants (vous y compris) sont à la charge de vos parents&nbsp;?</h1></legend>
      <label>
        <input min="1" type="number" v-select-on-click v-model.number="value">
      </label>
    </fieldset>
    <Actions v-bind:onSubmit='onSubmit'/>
  </form>
</template>
<script>
import Actions from '@/components/Actions'

export default {
  name: 'SimulationIndividuBourseCriteresSociauxNombreEnfantsACharge',
  components: {
    Actions,
  },
  data: function() {
      const famille = this.$store.getters.getFamille || {}
      return {
        famille,
        value: famille.bourse_criteres_sociaux_nombre_enfants_a_charge,
      }
  },
  methods: {
      onSubmit: function() {
          if (this.value === undefined) {
              this.$store.dispatch('updateError', 'Ce champ est obligatoire.')
              return
          }
          this.famille.bourse_criteres_sociaux_nombre_enfants_a_charge = this.value
          this.$store.dispatch('updateFamille', this.famille)
          this.$push()
      }
  }
}
</script>
