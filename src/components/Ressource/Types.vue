<template>
  <form>
    <h1>{{ title }}</h1>
    <p>
      Sélectionnez les types de ressources perçues <strong>depuis {{ dates.twelveMonthsAgo.label }}</strong>,
      vous pourrez ensuite saisir les montants.
    </p>
      <fieldset class="form__group" v-for="category in categories" v-bind:key="category.id">
        <h2>{{ category.label }}</h2>
        <label v-for="type in sort(typesByCategories[category.id])" v-bind:key="type.id">
          <input type="checkbox" v-model="selectedTypes[type.id]"/>
          {{ type.label }}
        </label>
      </fieldset>
    <div class="form__group">{{ countLabel }}</div>
    <div class="text-right">
      <button class="button large" v-on:click.prevent="next">Valider</button>
    </div>
  </form>
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
      typesByCategories: _.groupBy(types, t => t.category),
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
    },
    sort: function(array) {
      return _.orderBy(array, ['positionInList','label'])
    }
  },
  watch: {
    individu: function() {
      this.selectedTypes = Ressource.getIndividuRessourceTypes(this.individu)
    }
  }
}
</script>

<style scoped lang="css">
h2 {
  font-size: 1.5em;
}
</style>
