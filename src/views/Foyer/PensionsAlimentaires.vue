<template>
  <div class="container">
    <div>
      <div class="form__group">
        <fieldset>
          <legend><h1>Vous ou votre conjoint·e actuel·le avez-vous <b>versé</b> des pensions alimentaires <b>
      depuis {{ debutAnneeGlissante }}</b> ?</h1></legend>
          <label><input type="radio" v-bind:value="true" name="couple" v-model="parentsPayPensionsAlimentaires">Oui</label>
          <label><input type="radio" v-bind:value="false" name="couple" v-model="parentsPayPensionsAlimentaires">Non</label>
        </fieldset>
      </div>
    </div>
    <div class="text-right">
      <button class="button large" v-on:click="next">Valider</button>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { ressourceTypes } from '@/constants/resources'
import Individu from '@/lib/Individu'
import Situation from '@/lib/Situation'

export default {
  name: 'pensions-alimentaires',
  components: {
  },
  data () {
    let situation = this.$SituationService.restoreLocal()
    const debutAnneeGlissante = moment(situation.dateDeValeur).subtract(1, 'years').format('MMMM YYYY')
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
      debutAnneeGlissante,
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
      this.$router.push('/foyer/resultat')
    },
  }
}
</script>

<style scoped lang="css">
</style>
