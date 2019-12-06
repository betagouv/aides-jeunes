<template>
  <div>
    <form class="form__group">
      <div class="form__group">
        <fieldset>
          <label><input type="radio" v-bind:value="false" name="couple" v-model="isInCouple">Je vis seul·e</label>
          <label><input type="radio" v-bind:value="true" name="couple" v-model="isInCouple">Je vis en couple</label>
        </fieldset>
      </div>

      <div v-if="captureRsaIsolementRecent" class="form__group">
        <fieldset>
          <legend><h2>Depuis combien de temps vivez-vous seul·e ?</h2></legend>
          <label><input type="radio" v-bind:value="true" name="isolement" v-model="rsa_isolement_recent">Moins de 18 mois</label>
          <label><input type="radio" v-bind:value="false" name="isolement" v-model="rsa_isolement_recent">Plus de 18 mois</label>
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

export default {
  name: 'conjoint',
  components: {
    IndividuForm
  },
  data () {
    let situation = this.$store.state.situation
    let demandeur = situation.demandeur
    let isFirstView = demandeur.statut_marital === undefined

    let existingIndividu = Boolean(this.$store.state.situation.conjoint)
    let conjoint = existingIndividu ? this.$store.state.situation.conjoint :  Individu.getConjoint()
        
    return {
      conjoint,
      demandeur,
      existingIndividu,
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
      return this.situation.enfants.length
    },
    rsa_isolement_recent: {
      get: function() {
        return this.$store.state.situation.famille.rsa_isolement_recent
      },
      set: function(value) {
        this.$store.commit('updateFamille', Object.assign({}, this.$store.state.situation.famille, {rsa_isolement_recent: value}))
      }
    }
  },
  methods: {
    next: function() {
      if (this.isInCouple) {
        this.$store.commit('updateFamille', Object.assign({}, this.$store.state.situation.famille, {rsa_isolement_recent: false}))
        this.$store.commit('updateIndividu', this.conjoint)
        this.$store.commit('updateIndividu', Object.assign({}, this.demandeur, { statut_marital: this.conjoint.statut_marital }))
      } else {
        this.$store.commit('removeConjoint')
        this.$store.commit('updateIndividu', Object.assign({}, this.demandeur, { statut_marital: 'celibataire' }))
      }

      this.$push()
    },
  }
}
</script>

<style scoped lang="css">
</style>
