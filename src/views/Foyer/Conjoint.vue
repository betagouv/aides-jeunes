<template>
  <div>
    <form class="form__group">
      <div class="form__group">
        <fieldset>
          <legend><h1>Vivez-vous seul·e ou en couple ?</h1></legend>
          <label><input type="radio" v-bind:value="false" name="couple" v-model="isInCouple">Je vis seul·e</label>
          <label><input type="radio" v-bind:value="true" name="couple" v-model="isInCouple">Je vis en couple</label>
        </fieldset>
      </div>

      <div v-if="captureRsaIsolementRecent" class="form__group">
        <fieldset>
          <legend><h2>Depuis combien de temps vivez-vous seul·e ?</h2></legend>
          <label><input type="radio" v-bind:value="true" name="isolement" v-model="famille.rsa_isolement_recent">Moins de 18 mois</label>
          <label><input type="radio" v-bind:value="false" name="isolement" v-model="famille.rsa_isolement_recent">Plus de 18 mois</label>
        </fieldset>
      </div>
      <div class="text-right" v-if="!isInCouple">
        <button type="submit" class="button large" v-on:click.prevent="next">Valider</button>
      </div>
    </form>
    <IndividuForm v-if="isInCouple" class="form__group" v-model="conjoint" v-bind:existingIndividu="existingIndividu" v-on:input="next" />
  </div>
</template>

<script>
import IndividuForm from '@/components/IndividuForm'
import Individu from '@/lib/Individu'
import Situation from '@/lib/Situation'

export default {
  name: 'conjoint',
  components: {
    IndividuForm
  },
  data () {
    let situation = this.$SituationService.restoreLocal()
    let demandeur = Situation.getDemandeur(situation)
    let isFirstView = demandeur.statut_marital === undefined

    let { existingIndividu, individu: conjoint} = Individu.get(situation.individus, 'conjoint')
        
    return {
      conjoint,
      demandeur,
      existingIndividu,
      famille: situation.famille,
      situation,
      isFirstView,
      isInCouple: isFirstView ? undefined : existingIndividu,
    }
  },
  computed: {
    captureRsaIsolementRecent: function() {
      return this.isInCouple == false && this.hasChildren
    },
    hasChildren: function() {
      return Situation.getEnfants(this.situation).length
    },
  },
  methods: {
    next: function() {
      if (this.isInCouple) {
        delete this.famille.rsa_isolement_recent
        Situation.setConjoint(this.situation, this.conjoint)
        this.demandeur.statut_marital = this.conjoint.statut_marital
      } else {
        this.demandeur.statut_marital = 'celibataire'
        let c = Situation.getConjoint(this.situation)
        if (c) {
          this.situation.individus.pop()
        }
      }

      this.$SituationService.saveLocal()
      this.$push()
    },
  }
}
</script>

<style scoped lang="css">
</style>
