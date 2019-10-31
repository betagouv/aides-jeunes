<template>
  <div class="container">
    <form>
      <h1>{{ title }}</h1>
      <p>
        Indiquez toutes les ressources <strong>nettes versées</strong> perçues en France comme à l'étranger.
      </p>
      <fieldset class="form__group" v-for="type in types" v-bind:key="type.meta.id">
        <h3>{{ type.meta.label }}</h3>
        <label>Percevez-vous le même montant tous les mois ?</label>
        <YesNoQuestion v-model="type.displayMonthly"/>
        <label v-if="type.displayMonthly!=undefined">
          Indiquez {{ type.displayMonthly ? "le montant que vous percevez chaque mois" : "les montants que vous avez perçu en" }} :
        </label>
        <input type="number" v-model.number="type.montant.thisMonth" v-if="type.displayMonthly==true"/>
        <div v-if="type.displayMonthly==false">
          <div v-for="month in type.months" v-bind:key="month.id">
            <label>{{ month.label | capitalize }}</label>
            <input type="number" v-model.number="type.montant[month.id]">
          </div>
        </div>
      </fieldset>
      <div class="text-right">
        <button class="button large" v-on:click.prevent="next">Valider</button>
      </div>
    </form>
  </div>
</template>

<script>
import YesNoQuestion from '@/components/YesNoQuestion'
import {ressourceTypes} from '@/constants/resources'
import Ressource from '@/lib/Ressource'
import Individu from '@/lib/Individu'

export default {
  name: 'ressources-montants',
  components: {
    YesNoQuestion
  },
  data: function() {
    let situation = this.$SituationService.restoreLocal()
    let individu = Individu.find(situation.individus, this.$route.params.role, this.$route.params.id)
    let selectedTypes = Ressource.getIndividuRessourceTypes(individu)

    let types = ressourceTypes.reduce((result, type) => {
      if (selectedTypes[type.id]) {
        let montant = Object.assign({ [this.dates.thisMonth.id]: 0 },
          this.dates.last12Months.reduce((result, month) => {
              result[month.id] = 0
              return result
            }, {})
          )
        result.push({ 
          montant,
          months: [].concat(this.dates.thisMonth, this.dates.last12Months),
          displayMonthly: false, // TODO undefined
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
      let individu = Individu.find(situation.individus, this.$route.params.role, this.$route.params.id)

      this.types.forEach((t) => {
        let monthlyMontant = t.displayMonthly ? t.montant.thisMonth : Math.round(t.montant.thisYear/12)
        individu[t.id] = this.dates.last12Months.reduce((accum, period) => {
          accum[period.id] = monthlyMontant
          return accum
        }, {})
        individu[t.id][this.dates.thisMonth.id] = monthlyMontant
        individu[t.id][this.dates.thisYear.id] = t.displayMonthly ? t.montant.thisMonth*12 : t.montant.thisYear
      })
      this.$SituationService.saveLocal()
      this.$push(situation)
    }
  }
}
</script>
