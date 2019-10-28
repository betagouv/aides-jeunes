<template>
  <div class="container">
    <h1>{{ title }}</h1>
    <legend>
      Sélectionnez les types de ressources perçues <strong>depuis {{ dates.twelveMonthsAgo.label }}</strong>,
      vous pourrez ensuite saisir les montants.
    </legend>
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
import Individu from '@/lib/Individu'
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
      selectedTypes,
      types: _.filter(ressourceTypes, Ressource.isRessourceOnMainScreen),
    }
  },
  computed: {
    count: function() {
      return _.filter(this.selectedTypes).length
    },
    title: function() {
      return Individu.ressourceHeader(this.individu)
    },
  },
  methods: {
    next: function() {
      let situation = this.$SituationService.restoreLocal()
      Ressource.setIndividuRessourceTypes(this.individu, this.selectedTypes, this.dates)
      this.$SituationService.saveLocal()
      if (this.count) {
        this.$router.push({ name: 'ressources/montants', params: this.$route.params })
      } else {
        this.$router.push(RouteLogic.next(situation, this.$route))
      }
    }
  },
  watch: {
    individu: function() {
      this.selectedTypes = Ressource.getIndividuRessourceTypes(this.individu)
    }
  }
}
</script>
