<template>
  <form @submit.prevent="next">
    <h1>Les revenus imposables de votre foyer en {{ $store.state.dates.fiscalYear.label }}</h1>
    <p>
      Ces informations se trouvent sur votre avis d'imposition {{ $store.state.dates.lastYear.label }} sur les revenus {{ $store.state.dates.fiscalYear.label }}.
      <br>Vous pouvez le retrouver en ligne sur <a target="_blank" rel="noopener" href="http://www.impots.gouv.fr/">impots.gouv.fr</a>.
    </p>

    <div class="form__group" v-for="individu in individus" v-bind:key="individu.source.id">
      <button type="button" v-if="!individu.display" v-on:click="individu.display = !individu.display">
        Déclarer des ressources pour {{ individu.label }}
      </button>
      <div v-if="individu.display">
        <h2>{{ individu.label | capitalize }}</h2>
        <label class="form__group" v-for="ressource in categoriesRnc" v-bind:key="ressource.id">
          {{ ressource.label }}
          <input type="number" v-model.number="individu.source[ressource.id][$store.state.dates.fiscalYear.id]" />
          <span v-if="individu.default[ressource.id]"> Ce montant vaut {{ individu.default[ressource.id] }} pour les 12 derniers mois.</span>
        </label>
      </div>
    </div>

    <div class="text-right">
      <button type="submit" class="button large">Valider</button>
    </div>
  </form>
</template>

<script>
import _ from 'lodash'
import Individu from '@/lib/Individu'
import Situation from '@/lib/Situation'
import { categoriesRnc } from '@/constants/resources'

function getDefaultValue(months, individu, rnc) {
  return _.sum((rnc.sources || []).map(function(sourceName) {
    if (! individu[sourceName]) {
      return 0
    }

    var ressource = individu[sourceName]
    return _.sum(months.map(month => ressource[month.id] || 0))
  }))
}

export default {
  name: 'ressources-fiscales',
  components: {
  },
  data: function() {
    let situation = this.$store.state.situation
    const fiscalYear = this.$store.state.dates.fiscalYear.id
    let individus = Situation.getIndividusSortedParentsFirst(situation).map((source) => {
      var individu = {
        label: Individu.label(source),
        default: {},
        source,
      }

      categoriesRnc.forEach((categorieRnc) => {
        source[categorieRnc.id] = source[categorieRnc.id] || {}
        source[categorieRnc.id][fiscalYear] = source[categorieRnc.id][fiscalYear] || undefined
        individu.default[categorieRnc.id] = getDefaultValue(this.$store.state.dates.last12Months, source, categorieRnc)
      })

      individu.display = Individu.isParent(source) || _.some(categoriesRnc.map(ressource => source[ressource.id][fiscalYear] !== undefined))
      return individu
    })

    return {
      categoriesRnc,
      individus,
    }
  },
  methods: {
    next: function() {
      this.individus.forEach(i => this.$store.commit('updateIndividu', i.source))
      this.$push()
    },
  }
}
</script>
