<template>
  <div class="container">
    <form>
      <h1>{{ title }}</h1>
      <p>
        Indiquez toutes les ressources <strong>nettes versées</strong> perçues en France comme à l'étranger.
      </p>
      <label v-for="type in types" v-bind:key="type.id">
        {{ type.label }}
        <input type="number" v-model.number="type.montant"/>
      </label>
      <div class="text-right">
        <button class="button large" v-on:click.prevent="next">Valider</button>
      </div>
    </form>
  </div>
</template>

<script>
import {ressourceTypes} from '@/constants/resources'
import Ressource from '@/lib/Ressource'
import Individu from '@/lib/Individu'
import { datesGenerator } from '@/../backend/lib/mes-aides'

export default {
  name: 'ressources-montants',
  data: function() {
    let situation = this.$SituationService.restoreLocal()
    let individu = Individu.find(situation.individus, this.$route.params.role, this.$route.params.id)
    let selectedTypes = Ressource.getIndividuRessourceTypes(individu)

    let types = ressourceTypes.reduce((result, ressource) => {
      if (selectedTypes[ressource.id]) {
        result.push(Object.assign({ montant: individu[ressource.id][this.dates.thisMonth.id] || 0 }, ressource))
      }
      return result
    }, [])

    return {
      types,
      individu,
    }
  },
  computed: {
    title: function() {
      return Individu.ressourceHeader(this.individu)
    },
  },
  methods: {
    next: function() {
      let situation = this.$SituationService.restoreLocal()
      let individu = Individu.find(situation.individus, this.$route.params.role, this.$route.params.id)

      this.types.forEach((t) => {
        individu[t.id] = this.dates.last12Months.reduce((accum, period) => {
          accum[period.id] = t.montant
          return accum
        }, {})
        individu[t.id][this.dates.thisMonth.id] = t.montant
      })
      this.$SituationService.saveLocal()
      this.$push(situation)
    }
  }
}
</script>
