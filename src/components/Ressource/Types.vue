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
    <div>
      {{ count }} ressources sélectionées
    </div>
    <div class="text-right">
      <button class="button large" v-on:click="next">Valider</button>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import {ressourceTypes} from '@/constants/resources'
import Ressource from '@/lib/Ressource'
import RouteLogic from '@/lib/RouteLogic'

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
  computed: {
    count: function() {
      return _.filter(this.selectedTypes).length
    }
  },
  methods: {
    next: function() {
      let situation = this.$SituationService.restoreLocal()
      Ressource.setIndividuRessourceTypes(this.individu, this.selectedTypes, situation.dateDeValeur)
      this.$SituationService.saveLocal()
      this.$router.push(RouteLogic.next(situation, this))
    }
  }
}
</script>
