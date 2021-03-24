<template>
  <form @submit.prevent='onSubmit'>
    <label class="form__group">
      Et combien (vous y compris) font des études supérieures&nbsp;?
      <input min="1" type="number" v-select-on-click v-model.number="value">
    </label>
    <Actions v-bind:onSubmit='onSubmit'/>
  </form>
</template> 

    <script>
import Actions from '@/components/Actions'

export default {
  name: 'SimulationIndividuBourseCriteresSociauxNombreEnfantsAChargeDansEnseignementSuperieure',
  components: {
    Actions,
  },
  data: function() {
      const famille = this.$store.getters.getFamille || {}
      return {
        famille,
        value: famille.bourse_criteres_sociaux_nombre_enfants_a_charge_dans_enseignement_superieur,
      }
  },
  methods: {
      onSubmit: function() {
          if (this.value === undefined) {
              this.$store.dispatch('updateError', 'Ce champ est obligatoire.')
              return
          }
          this.famille.bourse_criteres_sociaux_nombre_enfants_a_charge_dans_enseignement_superieur = this.value
          this.$store.dispatch('updateFamille', this.famille)
          this.$push()
      }
  }
}
</script>
