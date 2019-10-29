<template>
  <div class="container">
    <div>
      <div class="form__group">
        <YesNoQuestion v-model="parentsPayPensionsAlimentaires"><h1>
          Vous ou votre conjoint·e actuel·le avez-vous <b>versé</b> des pensions alimentaires <b>
          depuis {{ dates.twelveMonthsAgo.label }}</b> ?
        </h1></YesNoQuestion>
      </div>
    </div>
    <div class="text-right">
      <button class="button large" v-on:click="next">Valider</button>
    </div>
  </div>
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
