<template>
  <div class="text container">

    <h1>Évaluez votre prime d'activité en moins d'une minute</h1>

    <p>Beaucoup trop d'auto-entrepreneuses et auto-entrepreneurs ne demandent pas la prime d'activité. Nous voulons changer cela.</p>

    <p>Nous vous proposons de faire une simulation très rapide à partir de votre chiffre d'affaire sur les 3 derniers mois.</p>

    <div class="form__group">
      <label v-for="month in $store.state.dates.last3Months" v-bind:key="month.id">
        Chiffre d'affaires pour {{ month.label | capitalize }}
        <input
          type="number" v-select-on-click
          v-model="ressource[month.id]">
      </label>
    </div>

    <div>
      <a
        class="text-center button large primary"
        v-on:click="sayHi()"
        v-analytics="{ name:'ppa', action:'Évaluer', category:'AutoEntreprise'}"
      >
      Évaluer mon droit à la prime d'activité
      </a>

      <div v-show="$store.state.calculs.updating"><i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Calcul en cours de vos droits…</div>
    </div>

    <div v-if="$store.getters.hasResults">
      <div v-if="ppa">
        <p>
          D'après ces premières informations, vous êtes a priori éligible à la prime d'activité pour un montant de
        </p>
        <h2>{{ppa.montant}} € / mois</h2>
        <p>
          Vous pouvez affiner ce montant en faisant une simulation plus détaillée à partir de <router-link to="foyer/demandeur">
            la page suivante
         </router-link>.
        </p>

        <div>
          <a
            target="_blank"
            rel="noopener"
            class="text-center button primary"
            v-bind:href="ppa.teleservice"
            v-analytics="{ name:'ppa', action:'Faire la demande', category:'AutoEntreprise'}"
          >
          Faire la demande
          </a>
          <router-link to="foyer/demandeur" class="text-center button secondary"
            v-analytics="{ name:'ppa', action:'Évaluer mes autres droits', category:'AutoEntreprise'}"
          >
            Évaluer mes autres droits
         </router-link>
        </div>
      </div>
      <div v-else>
        <p>
          D'après ces premières informations, vous n'êtes pas éligible à la prime d'activité. Cela dit, nous avons considéré que vous viviez seul·e et sans enfant. Nous vous conseillons de préciser votre situation pour que le résultat de la simulation soit plus fiable.
        </p>
        <div>
          <router-link to="foyer/demandeur" class="text-center button primary"
            v-analytics="{ name:'ppa', action:'Préciser ma situation', category:'AutoEntreprise'}"
          >
            Préciser ma situation
          </router-link>
        </div>
      </div>
    </div>

    <p>
      Vous avez une question ou une difficulté&nbsp;? N'hésitez pas à nous contacter par email à
      <a
      v-analytics="{ name: 'ppa', action:'Support', category:'AutoEntreprise'}"
      v-mail="{to: 'equipe@mes-aides.org', subject:`[${ resultatsId }] Question`}">equipe@mes-aides.org</a>.
    </p>

    <div v-if="$store.getters.hasResults">
      <a class="text-center button-outline secondary"
        v-analytics="{ name:'ppa', action:'Remettre à zéro', category:'AutoEntreprise'}"
        v-on:click="reset()">
        Remettre à zéro
      </a>
    </div>
  </div>
</template>

<script>
import Individu from '@/lib/Individu'


export default {
  name: 'AutoEntreprise',
  data: function () {
    this.$store.dispatch('initialize')
    const {demandeur, ressource, ppa} = this.prepare()

    return {
      demandeur,
      ressource,
      ppa
    }
  },
  methods: {
    reset: function() {
      this.$store.dispatch('clear')
      const {demandeur, ressource, ppa} = this.prepare()

      this.demandeur = demandeur
      this.ressource = ressource
      this.ppa = ppa
    },
    prepare: function() {
      const demandeur = Individu.getDemandeur()
      delete demandeur.taux_incapacite
      this.$store.state.dates.last3Months.forEach(m => {
        let ressource = demandeur.tns_auto_entrepreneur_chiffre_affaires || {}
        ressource[m.id] = ressource[m.id] || 0
        demandeur.tns_auto_entrepreneur_chiffre_affaires = ressource
      })
      return {
        demandeur,
        ressource: Object.assign({}, demandeur.tns_auto_entrepreneur_chiffre_affaires),
        ppa: null
      }
    },
    sayHi: function() {
      const that = this
      if (that.$store.state.calculs.updating) {
        return
      }
      this.ppa = null
      this.$store.dispatch('updateIndividu', Object.assign({}, this.demandeur, { tns_auto_entrepreneur_chiffre_affaires: Object.assign({}, this.ressource) }))
      this.$store.dispatch('save')
        .then(() => that.$store.dispatch('compute'))
        .then(() => {
          const c = that.$store.state.calculs
          if (!c || ! c.resultats) {
            return
          }
          that.ppa = find(c.resultats.droitsEligibles, { id: 'ppa' })          
        })
        .catch(() => {
          that.$matomo && that.$matomo.trackEvent('AutoEntreprise', 'Erreur', 'ppa')
        })
    }
  }
}
</script>

<style>
.text.container {
  flex-grow: 1;
  margin-top: 3em;
}
</style>
