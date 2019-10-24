<template>
  <div class="container">
    <RessourceTypes v-bind:individu="individu" />
    <div class="text-right">
      <button class="button large" v-on:click="next">Valider</button>
    </div>
  </div>
</template>

<script>
import RessourceTypes from '@/components/Ressource/Types'
import Individu from '@/lib/Individu'
import Ressource from '@/lib/Ressource'

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
      let situation = this.$SituationService.restoreLocal()
      Ressource.setIndividuRessourceTypes(this.individu, this.selectedTypes, situation.dateDeValeur)
      this.$SituationService.saveLocal()

      if (this.count) {
        this.$router.push({ name: 'ressources/montants', params: { role: this.individu.role, id: this.individu.id } })
      } else {
        this.$router.push('/foyer/pensions-alimentaires')
        // if (this.individu.role === 'demandeur') {

        // } else {
        //   // if conjoint -> conjoint/ressources/types
        //   // elsif enfants -> enfants/ressources
        //   // else pensions-alimentaires
        // }
      }
    }
  }
}
</script>
