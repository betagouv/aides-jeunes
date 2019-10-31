<template>
  <div class="container">
    <h1>{{ title }}</h1>
    <legend>
      Sélectionnez les types de ressources perçues <strong>depuis {{ dates.twelveMonthsAgo.label }}</strong>,
      vous pourrez ensuite saisir les montants.
    </legend>
    <form>
      <div v-for="category in categories" v-bind:key="category.id">
        <h3>{{ category.label }}</h3>
        <label v-for="type in typesByCategories[category.id]" v-bind:key="type.id">
          <input type="checkbox" v-model="selectedTypes[type.id]"/>
          {{ type.label }}
        </label>
      </div>
    </form>
    <div>{{ countLabel }}</div>
    <div class="text-right">
      <button class="button large" v-on:click="next">Valider</button>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import {ressourceCategories, ressourceTypes} from '@/constants/resources'
import Individu from '@/lib/Individu'
import Ressource from '@/lib/Ressource'

export default {
  name: 'RessourceTypes',
  props: {
    individu: Object
  },
  data: function() {
    let selectedTypes = Ressource.getIndividuRessourceTypes(this.individu)
    let types = _.filter(ressourceTypes, Ressource.isRessourceOnMainScreen)

    return {
      selectedTypes,
      categories: ressourceCategories,
      typesByCategories: _.groupBy(types, t => t.category)
    }
  },
  computed: {
    countLabel: function() {
      const count = _.filter(this.selectedTypes).length
      return `${count} ${count == 1 ? 'ressource sélectionnée' : 'ressources sélectionnées'}`
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
      this.$push(situation)
    }
  },
  watch: {
    individu: function() {
      this.selectedTypes = Ressource.getIndividuRessourceTypes(this.individu)
    }
  }
}
</script>
