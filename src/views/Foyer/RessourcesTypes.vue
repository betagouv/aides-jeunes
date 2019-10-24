<template>
  <div class="container">
    <h1>Vos ressources personnelles uniquement</h1>
    Sélectionnez les types de ressources perçues <strong>depuis octobre 2018</strong>,
    vous pourrez ensuite saisir les montants.
    <form>
      <label v-for="ressourceType in ressourceTypes">
        <input type="checkbox" v-model="selectedRessourceTypes[ressourceType.id]"/>
        {{ ressourceType.label }}
      </label>
    </form>
    <div class="text-right">
      <button class="button large" v-on:click="next">Valider</button>
    </div>
  </div>
</template>

<script>
import {ressourceTypes} from '@/constants/resources'
import Situation from '@/lib/Situation'
import Ressource from '@/lib/Ressource'

export default {
  name: 'ressources-types',
  data: function() {
    let situation = this.$SituationService.restoreLocal()
    let demandeur = Situation.getDemandeur(situation)
    let selectedRessourceTypes = Ressource.getIndividuRessourceTypes(demandeur)

    return {
      ressourceTypes,
      selectedRessourceTypes,
    }
  },
  methods: {
    next: function() {
      let situation = this.$SituationService.restoreLocal()
      let demandeur = Situation.getDemandeur(situation)
      Ressource.setIndividuRessourceTypes(demandeur, this.selectedRessourceTypes, situation.dateDeValeur)
      this.$SituationService.saveLocal()
      this.$router.push('/foyer/pensions-alimentaires')
    }
  }
}
</script>
