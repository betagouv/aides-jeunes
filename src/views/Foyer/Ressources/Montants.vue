<template>
  <div class="container">
    {{individu.id}}
    <label v-for="type in types" v-bind:key="type.id">
      {{ type.label }}
      <input type="number" v-model.number="type.montant"/>
    </label>
    <div class="text-right">
      <button class="button large" v-on:click="next">Valider</button>
    </div>
  </div>
</template>

<script>
import {ressourceTypes} from '@/constants/resources'
import Ressource from '@/lib/Ressource'
import Individu from '@/lib/Individu'
import RouteLogic from '@/lib/RouteLogic'
import { getPeriods } from '@/../backend/lib/openfisca/mapping/common'

export default {
  name: 'ressources-montants',
  data: function() {
    let situation = this.$SituationService.restoreLocal()
    let periods = getPeriods(situation.dateDeValeur)
    let individu = Individu.find(situation.individus, this.$route.params.role, this.$route.params.id)
    let selectedTypes = Ressource.getIndividuRessourceTypes(individu)

    let types = ressourceTypes.reduce((result, ressource) => {
      if (selectedTypes[ressource.id]) {
        result.push(Object.assign({ montant: individu[ressource.id][periods.thisMonth] || 0 }, ressource))
      }
      return result
    }, [])

    return {
      types,
      individu,
    }
  },
  methods: {
    next: function() {
      let situation = this.$SituationService.restoreLocal()
      let periods = getPeriods(situation.dateDeValeur)
      let individu = Individu.find(situation.individus, this.$route.params.role, this.$route.params.id)

      this.types.forEach((t) => {
        individu[t.id] = periods.last12Months.reduce((accum, p) => {
          accum[p] = t.montant
          return accum
        }, {})
        individu[t.id][periods.thisMonth] = t.montant
      })
      let s = this.$SituationService.saveLocal()
      this.$router.push(RouteLogic.next(s, this.$route))
    }
  }
}
</script>
