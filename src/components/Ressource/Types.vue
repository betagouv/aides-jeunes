<template>
  <div class="container">
    <h1>Vos ressources personnelles uniquement</h1>
    Sélectionnez les types de ressources perçues <strong>depuis octobre 2018 <!-- TODO --> </strong>,
    vous pourrez ensuite saisir les montants.
    <form>
      <label v-for="type in types" v-bind:key="type.id">
        <input type="checkbox" v-model="selectedTypes[type.id]"/>
        {{ type.label }}
      </label>
    </form>
    <div class="text-right">
      <button class="button large" v-on:click="next">Valider</button>
    </div>
  </div>
</template>

<script>
import {ressourceTypes} from '@/constants/resources'
import Ressource from '@/lib/Ressource'

export default {
  name: 'RessourceTypes',
  props: {
    individu: Object
  },
  data: function() {
    let selectedTypes = Ressource.getIndividuRessourceTypes(this.individu)
    return {
      types: ressourceTypes,
      selectedTypes,
    }
  },
  methods: {
    next: function() {
      let situation = this.$SituationService.restoreLocal()
      Ressource.setIndividuRessourceTypes(this.individu, this.selectedTypes, situation.dateDeValeur)
      this.$SituationService.saveLocal()
      this.$router.push('/foyer/pensions-alimentaires')
    }
  }
}
</script>
