<template>
  <form>
    <p>
      Sélectionnez les types de ressources perçues
      <strong>
      <span v-if="individu._role === 'conjoint'">par votre conjoint(e)</span>
      <span v-else-if="individu._role !== 'demandeur'">par {{ individu._firstName }}</span>
      depuis {{ $store.state.dates.twelveMonthsAgo.label }}</strong>.
      Vous pourrez ensuite saisir les montants.
    </p>
      <div class="form__group" v-for="category in categories" v-bind:key="category.id">
        <h2>{{ category.label }}</h2>
        <label v-for="type in sort(typesByCategories[category.id])" v-bind:key="type.id">
          <input type="checkbox" v-model="selectedTypes[type.id]"/>
          {{ type.label }}
        </label>
      </div>
    <div class="form__group">{{ countLabel }}</div>
    <Actions v-bind:onSubmit='onSubmit'>
    </Actions>
  </form>
</template>

<script>
import Actions from '@/components/Actions'
import _ from 'lodash'
import {ressourceCategories, ressourceTypes} from '@/constants/resources'
import Ressource from '@/lib/Ressource'

export default {
  name: 'RessourceTypes',
  components: {
      Actions
  },
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
    onSubmit: function() {
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
