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
import ressources from '@/constants/resources'
import Situation from '@/lib/Situation'

export default {
  name: 'ressources-types',
  data: function() {
    let situation = this.$SituationService.restoreLocal()
    var demandeur = Situation.getDemandeur(situation)

    return {
      demandeur: demandeur,
      ressourceTypes: ressources.ressourceTypes,
      selectedRessourceTypes: {}
    }
  },
  methods: {
    // initializeSelectedRessourceTypes: function() {
    //   var selectedRessourceTypes = {}
    //   ressources.ressourceTypes.forEach(function(ressourceType) {
    //     if (this.demandeur[ressourceType.id]) {
    //       selectedRessourceTypes[ressourceType.id] = true
    //     }
    //   })
    //   return selectedRessourceTypes
    // },
    updateIndividuRessources: function(individu, selectedRessourceTypes) {
        Object.keys(selectedRessourceTypes).forEach(function(ressourceTypeId) {
            if (selectedRessourceTypes[ressourceTypeId]) {
                individu[ressourceTypeId] = individu[ressourceTypeId] || {};
            }
        })
    },
    next: function() {
      console.log(this.demandeur)
      console.log(this.selectedRessourceTypes)
      this.updateIndividuRessources(this.demandeur, this.selectedRessourceTypes)
      console.log(this.demandeur)
      this.$router.push('/foyer/pensions-alimentaires')
    }
  }
}
</script>