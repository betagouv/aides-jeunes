<template>
  <div class="container">
    <h1>{{ title }}</h1>
    Sélectionnez les types de ressources perçues <strong>depuis {{ debutAnneeGlissante }}</strong>,
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
import moment from 'moment'
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
    let situation = this.$SituationService.restoreLocal()
    let debutAnneeGlissante = moment(situation.dateDeValeur).subtract(1, 'years').format('MMMM YYYY')
    let selectedTypes = Ressource.getIndividuRessourceTypes(this.individu)

    return {
      debutAnneeGlissante,
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
      Ressource.setIndividuRessourceTypes(this.individu, this.selectedTypes, situation.dateDeValeur)
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
