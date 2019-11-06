<template>
  <form>
    <h1>Pensions alimentaires versées</h1>
    <YesNoQuestion class="form__group" v-model="parentsPayPensionsAlimentaires">
      Vous ou votre conjoint·e actuel·le avez-vous <strong>versé</strong> des pensions alimentaires <b>
      depuis {{ dates.twelveMonthsAgo.label }}</b> ?
    </YesNoQuestion>

    <div class="form__group" v-if="parentsPayPensionsAlimentaires">
      <div class="form__group" v-for="item in items" v-bind:key="item.individu.id">
        <h2>{{ individuLabel(item.individu) | capitalize }}</h2>
        <RessourceMontants without-header v-bind:individu="item.individu" v-bind:type="item" />
      </div>
    </div>

    <div class="text-right">
      <button class="button large" v-on:click.prevent="next">Valider</button>
    </div>
  </form>
</template>

<script>
import _ from 'lodash'
import { ressourceTypes } from '@/constants/resources'
import Individu from '@/lib/Individu'
import Ressource from '@/lib/Ressource'
import Situation from '@/lib/Situation'
import RessourceMontants from '@/components/Ressource/Montants'
import YesNoQuestion from '@/components/YesNoQuestion'

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
  name: 'pensions-alimentaires',
  components: {
    RessourceMontants,
    YesNoQuestion
  },
  data () {
    let situation = this.$SituationService.restoreLocal()
    let pensionsVersees = _.find(ressourceTypes, { id: 'pensions_alimentaires_versees_individu' })

    let demandeur = Situation.getDemandeur(situation)
    let conjoint = Situation.getConjoint(situation)
    let individus = [ demandeur ]
    if (conjoint) {
        individus.push(conjoint)
    }

    let items = individus.map(individu => {
      Ressource.setDefaultValueForCurrentYear(this.dates, individu, pensionsVersees)
      let amounts = individu[pensionsVersees.id]
      let months = Ressource.getPeriodsForCurrentYear(this.dates, pensionsVersees)

      return {
        individu,
        amounts,
        months,
        displayMonthly: getDisplayMonthly(months, amounts),
        meta: pensionsVersees
      }
    })

    return {
      items,
      pensionsVersees,
      parentsPayPensionsAlimentaires: items.reduce(function(accum, item) {
        return accum || _.some(item.amounts);
      }, false)
    }
  },
  methods: {
    individuLabel: Individu.label,
    next: function() {
      this.$SituationService.saveLocal()
      this.$push()
    },
  }
}
</script>

<style scoped lang="css">
</style>
