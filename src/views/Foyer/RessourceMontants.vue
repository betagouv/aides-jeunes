<template>
  <div class="container">
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
import { getPeriods } from '@/../backend/lib/openfisca/mapping/common'

export default {
  name: 'ressources-montants',
  data: function() {
    let situation = this.$SituationService.restoreLocal()
    let periods = getPeriods(situation.dateDeValeur)
    let individu = Individu.find(situation.individus, this.$route.params.role)
    // TODO enfants
    let selectedTypes = Ressource.getIndividuRessourceTypes(individu)
    // TODO : la fonction getIndividuRessourceTypes pourrait renvoyer un simple array avec les id des ressources

    let types = ressourceTypes.reduce((result, ressource) => {
      if (selectedTypes[ressource.id]) {
        result.push(Object.assign({ montant: individu[ressource.id][periods.thisMonth] || 0 }, ressource))
      }
      return result
    }, [])

    return {
      periods,
      types,
      individu,
    }
  },
  methods: {
    next: function() {
      this.types.forEach((t) => {
        this.individu[t.id] = this.periods.last12Months.reduce((accum, p) => {
          accum[p] = t.montant
          return accum
        }, {})
        this.individu[t.id][this.periods.thisMonth] = t.montant
      })
      this.$SituationService.saveLocal()
      this.$router.push('/foyer/pensions-alimentaires')
    }
  }
}
</script>
