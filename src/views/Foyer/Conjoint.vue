<template>
  <div class="container">
    <div>
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
    </div>
    <div v-if="isInCouple">
      <h3>Votre conjoint</h3>
      <div>TODO</div>
    </div>
    <div class="text-right">
      <button class="button large" v-on:click="next">Valider</button>
    </div>
  </div>
</template>

<script>
import Individu from '@/lib/Individu'
import Situation from '@/lib/Situation'

export default {
  name: 'conjoint',
  components: {
  },
  data () {
    let s = this.$SituationService.restoreLocal()
    let demandeur = Situation.getDemandeur(s)
    let isFirstView = demandeur.statut_marital === undefined

    let { individu: conjoint} = Individu.get(s.individus, 'conjoint')
    conjoint.date_naissance = new Date('1980-12-12')
        
    return {
      conjoint,
      demandeur,
      situation: s,
      famille: s.famille,
      isFirstView,
      isInCouple: isFirstView ? undefined : Boolean(Situation.getConjoint(s)),
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
          this.situtation.individus.pop()
        }
      }

      this.$SituationService.saveLocal()
      this.$router.push('/foyer/logement')
    },
  }
}
</script>

<style scoped lang="css">
</style>
