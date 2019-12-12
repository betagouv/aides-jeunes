<template>
  <form>
    <p>
      Sélectionnez les types de ressources perçues <strong>depuis {{ $store.state.dates.twelveMonthsAgo.label }}</strong>,
      vous pourrez ensuite saisir les montants.
    </p>
      <div class="form__group" v-for="category in categories" v-bind:key="category.id">
        <h2>{{ category.label }}</h2>
        <label v-for="type in sort(typesByCategories[category.id])" v-bind:key="type.id">
          <input type="checkbox" v-model="selectedTypes[type.id]"/>
          {{ type.label }}
        </label>
      </div>
    <div class="form__group">{{ countLabel }}</div>
    <div class="text-right">
      <button type="submit" class="button large" v-on:click.prevent="next">Valider</button>
    </div>
  </form>
</template>

<script>
import _ from 'lodash'
import {ressourceCategories, ressourceTypes} from '@/constants/resources'
import Ressource from '@/lib/Ressource'

export default {
  name: 'RessourceTypes',
  props: {
    individu: Object
  },
  data: function() {
    let types = _.filter(ressourceTypes, Ressource.isRessourceOnMainScreen)

    return {
      categories: ressourceCategories,
      typesByCategories: _.groupBy(types, t => t.category),
      selectedTypes: Ressource.getIndividuRessourceTypes(this.individu)
    }
  },
  computed: {
    countLabel: function() {
      const count = _.filter(this.selectedTypes).length
      return `${count} ${count == 1 ? 'ressource sélectionnée' : 'ressources sélectionnées'}`
    },
  },
  watch: {
    individu: function() {
      this.selectedTypes = Ressource.getIndividuRessourceTypes(this.individu)
    }
  },
  methods: {
    next: function() {
      Ressource.setIndividuRessourceTypes(this.individu, this.selectedTypes, this.$store.state.dates)
      this.$store.dispatch('updateIndividu', this.individu)
      this.$push(this.$store.state.situation)
    },
    sort: function(array) {
      return _.orderBy(array, ['positionInList','label'])
    }
  }
}
</script>

<style scoped lang="css">
h2 {
  font-size: 1.5em;
}
</style>
