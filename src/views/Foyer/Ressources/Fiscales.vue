<template>
  <form @submit.prevent="next">
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
          <input type="number" v-select-on-click v-model="individu.values[ressource.id][$store.state.dates.fiscalYear.id]" />
          <span v-if="individu.default[ressource.id]"> Ce montant vaut {{ individu.default[ressource.id] }} pour les 12 derniers mois.</span>
        </label>
      </div>
    </div>
    <Actions v-bind:onSubmit='onSubmit'/>
  </form>
</template>

<script>
import sum from 'lodash/sum'
import some from 'lodash/some'
import isNaN from 'lodash/isNaN'
import Individu from '@/lib/Individu'
import Actions from '@/components/Actions'
import { categoriesRnc } from '@/constants/resources'

function getDefaultValue(months, individu, rnc) {
  return sum((rnc.sources || []).map(function(sourceName) {
    if (! individu[sourceName]) {
      return 0
    }

    let ressource = individu[sourceName]
    return sum(months.map(month => ressource[month.id] || 0))
  }))
}

export default {
  name: 'ressources-fiscales',
  components: {
    Actions,
  },
  data: function() {
    const fiscalYear = this.$store.state.dates.fiscalYear.id
    let individus = this.$store.getters.peopleParentsFirst.map((source) => {
      let individu = {
        label: Individu.label(source),
        default: {},
        values: {},
        source,
      }

      categoriesRnc.forEach((categorieRnc) => {
        individu.values[categorieRnc.id] = Object.assign({}, source[categorieRnc.id] || {})
        individu.values[categorieRnc.id][fiscalYear] = source[categorieRnc.id] && source[categorieRnc.id][fiscalYear]
        individu.default[categorieRnc.id] = getDefaultValue(this.$store.state.dates.last12Months, source, categorieRnc)
      })

      individu.display = Individu.isParent(source) || some(categoriesRnc.map(ressource => source[ressource.id] && source[ressource.id][fiscalYear] !== undefined))
      return individu
    })

    return {
      categoriesRnc,
      individus,
    }
  },
  methods: {
    onSubmit: function() {
      const fiscalYear = this.$store.state.dates.fiscalYear.id

      this.individus.forEach(i => {
        this.categoriesRnc.forEach(categorieRnc => {
          const raw = i.values[categorieRnc.id][fiscalYear]
          const value = parseFloat(raw)
          i.values[categorieRnc.id][fiscalYear] = (raw === undefined) ? raw : (isNaN(value) ? 0 : value)
        })
        this.$store.dispatch('updateIndividu', Object.assign({}, i.source, i.values))
      })
      this.$push()
    },
  }
}
</script>
