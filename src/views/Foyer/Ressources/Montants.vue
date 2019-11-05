<template>
  <div class="container">
    <form>
      <h1>{{ title }}</h1>
      <p>
        Indiquez toutes les ressources <strong>nettes versées</strong> perçues en France comme à l'étranger.
      </p>
      <RessourceMontants v-for="type in types" v-bind:type="type" v-bind:key="type.meta.id"/>

      <div class="next form__group">
        <router-link tag="button" type="button" class="button secondary"
          v-bind:to="{ name: 'ressources/types', params:$route.params }">
          Déclarer d'autres ressources
        </router-link>
        <button class="button large" v-on:click.prevent="next">Valider</button>
      </div>
    </form>
  </div>
</template>

<script>
import RessourceMontants from '@/components/Ressource/Montants'
import {ressourceTypes} from '@/constants/resources'
import Ressource from '@/lib/Ressource'
import Individu from '@/lib/Individu'

function getDisplayMonthly(months, amounts) {
  const result = months.reduce((result, m) => {
    result.allNull = result.allNull && amounts[m.id] === null
    result.allSame = result.allSame && amounts[m.id] === result.initial
    return result
  }, { allNull: true, initial: amounts[months[0].id], allSame: true })

  if (result.allNull) {
    return undefined
  } else {
    return result.allSame
  }
}

export default {
  name: 'ressources-montants',
  components: {
    RessourceMontants
  },
  data: function() {
    let situation = this.$SituationService.restoreLocal()
    let individu = Individu.find(situation.individus, this.$route.params.role, this.$route.params.id)
    const selectedTypes = Ressource.getIndividuRessourceTypes(individu)

    let types = ressourceTypes.reduce((result, type) => {
      if (selectedTypes[type.id]) {
        let amounts = individu[type.id]
        let months = Ressource.getPeriodsForCurrentYear(this.dates, type)

        result.push({ 
          amounts,
          months,
          displayMonthly: getDisplayMonthly(months, amounts),
          meta: type
        })
      }
      return result
    }, [])

    return {
      title: Individu.ressourceHeader(individu),
      types,
    }
  },
  methods: {
    next: function() {
      let situation = this.$SituationService.restoreLocal()
      let individu = Individu.find(situation.individus, this.$route.params.role, this.$route.params.id)

      this.types.forEach(t => {
        t.months.forEach(m => {
            individu[t.meta.id][m.id] = t.amounts[m.id] || t.amounts[this.dates.thisMonth.id]
          })
        })

      this.$SituationService.saveLocal()
      this.$push(situation)
    }
  }
}
</script>
