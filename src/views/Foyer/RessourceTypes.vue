<template>
  <div class="container">
    <RessourceTypes v-bind:individu="individu" />
  </div>
</template>

<script>
import RessourceTypes from '@/components/Ressource/Types'
import Individu from '@/lib/Individu'

export default {
  name: 'ressources-types',
  components: {
    RessourceTypes,
  },
  data: function() {
    let situation = this.$SituationService.restoreLocal()
    let individu = Individu.find(situation.individus, this.$route.params.role)
    // TODO enfants

    return {
      individu,
    }
  },
  methods: {
    next: function() {
      // let situation = this.$SituationService.restoreLocal()
      // let demandeur = Situation.getDemandeur(situation)
      // Ressource.setIndividuRessourceTypes(demandeur, this.selectedRessourceTypes, situation.dateDeValeur)
      // this.$SituationService.saveLocal()
      // this.$router.push('/foyer/pensions-alimentaires')
    }
  }
}
</script>
