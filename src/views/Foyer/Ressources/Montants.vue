<template>
  <div class="container">
    <form>
      <h1>{{ title }}</h1>
      <p>
        Indiquez toutes les ressources <strong>nettes versées</strong> perçues en France comme à l'étranger.
      </p>
      <RessourceMontants v-for="type in types" v-bind:type="type" v-bind:key="type.meta.id"/>
      <div class="text-right">
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
        let montants = individu[type.id]
        let months = Ressource.getPeriodsForCurrentYear(this.dates, type)

        result.push({ 
          montants,
          months,
          displayMonthly: months.reduce((previousValuesAreEqual, m) => {
            return previousValuesAreEqual && montants[m.id] == montants[this.dates.thisMonth.id] && montants[m.id] != null
          }, true) || undefined,
          meta: type
        })
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

      this.types.forEach(t => {
        t.months.forEach(m => {
            this.individu[t.meta.id][m.id] = t.montants[m.id] || t.montants[this.dates.thisMonth.id]
          })
        })

      this.$SituationService.saveLocal()
      this.$push(situation)
    }
  }
}
</script>
