<template>
  <form>
    <h1>Pensions alimentaires versées</h1>
    <YesNoQuestion v-model="parentsPayPensionsAlimentaires">
      Vous ou votre conjoint·e actuel·le avez-vous <strong>versé</strong> des pensions alimentaires <b>
      depuis {{ dates.twelveMonthsAgo.label }}</b> ?
      </YesNoQuestion>
    <div class="text-right">
      <button class="button large" v-on:click.prevent="next">Valider</button>
    </div>
  </form>
</template>

<script>
import _ from 'lodash'
import { ressourceTypes } from '@/constants/resources'
import Individu from '@/lib/Individu'
import Situation from '@/lib/Situation'
import YesNoQuestion from '@/components/YesNoQuestion'

export default {
  name: 'pensions-alimentaires',
  components: {
    YesNoQuestion
  },
  data () {
    let situation = this.$SituationService.restoreLocal()
    var pensionsVersees = _.find(ressourceTypes, { id: 'pensions_alimentaires_versees_individu' })

    var demandeur = Situation.getDemandeur(situation)
    var conjoint = Situation.getConjoint(situation)
    var individus = [ demandeur ]
    if (conjoint) {
        individus.push(conjoint)
    }

    var parentsPayPensionsAlimentaires = false /* TODO $scope.individus.reduce(function(accum, individu) {
            return accum || _.some(individu.pensions_alimentaires_versees_individu);
        }, false),*/

    return {
      individus,
      parentsPayPensionsAlimentaires,
      pensionsVersees,
      situation,
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
