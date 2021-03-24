<template>
  <div class="container">
    <p v-show="accessStatus.fetching"><i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Récupération de la situation en cours…</p>
    <p v-show="resultatStatus.updating"><i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Calcul en cours de vos droits…</p>
    <div v-show="shouldDisplayResults">
      <div v-if="! isEmpty(droits)">
        <p>
          D'après la situation que vous avez décrite, vous êtes a priori éligible à ces aides.
          <span id="print-disclaimer">Ces résultats sont fondés sur les seules informations que vous avez indiquées et ne constituent en aucune façon un engagement de la part des organismes cités.</span>
          Les montants avancés sont arrondis à une dizaine d'euros près :
        </p>
        <DroitsList v-bind:droits="droits"></DroitsList>
      </div>
      <div v-if="! isEmpty(droitsNonEligiblesShown)">
        <p>
          Les conditions des aides suivantes <strong>ne sont pas</strong> remplies :
        </p>
        <DroitsList ineligible v-bind:droits="droitsNonEligiblesShown"></DroitsList>
      </div>
      <OfflineResults v-if="!resultatStatus.updating && ! isEmpty(droits)" v-bind:id="resultatsId" />

      <div class="notification warning print-hidden" v-if="! ressourcesYearMinusTwoCaptured">
        <span>
          <h2 v-if="droits && !droits.length">Votre simulation n'a pas permis de découvrir de nouveaux droits.</h2>
          <i class="fa fa-warning text-warning" aria-hidden="true"></i>

          Nous avons supposé que vos ressources pour l’année {{ $store.state.dates.fiscalYear.label }} étaient les mêmes qu’entre {{ $store.state.dates.twelveMonthsAgo.label }} et {{ $store.state.dates.oneMonthAgo.label }}.
        </span>

        <router-link class="button-outline warning text-center" to="ressources/fiscales">Déclarez vos ressources {{ $store.state.dates.fiscalYear.label }}</router-link>
      </div>

      <div class="frame-resultats" v-show="isEmpty(droits) && ressourcesYearMinusTwoCaptured">
          <h2>Votre simulation n'a pas permis de découvrir de nouveaux droits.</h2>
          <p>Si vous êtes dans une situation difficile, d'<router-link to="/sos">autres solutions existent</router-link>.</p>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import DroitsList from './../../components/DroitsList'
import OfflineResults from './../../components/OfflineResults'

export default {
  name: 'SimulationResultats',
  data: function() {
    return {
      openfiscaTracerURL: false,
      openfiscaAxeURL: false,
      showExpertLinks: false,
      showPrivate: false
    }
  },
  components: {
    DroitsList,
    OfflineResults
  },
  computed: {
    droits: function() { 
      return this.resultats && this.resultats.droitsEligibles
    },
    droitsInjectes: function() { return (this.resultats && this.resultats.droitsInjectes) || [] },
    droitsNonEligibles: function() {
      return (this.droitsNonEligiblesShow && this.resultats && this.resultats.droitsNonEligibles) || [] },
    droitsNonEligiblesShown: function() { return this.droitsNonEligibles.filter(i => i.id === "css_participation_forfaitaire") },
    droitsNonEligiblesShow: function() { return this.$store.state.ameliNoticationDone },
    resultatsId: function() { return this.resultats && this.resultats._id || '???' },
    accessStatus: function() { return this.$store.state.access },
    resultatStatus: function() { return this.$store.state.calculs },
    resultats: function() { return this.$store.state.calculs.resultats },
    ressourcesYearMinusTwoCaptured: function() { return this.$store.getters.ressourcesYearMinusTwoCaptured },
    situation: function() { return this.$store.state.situation },
    shouldPatrimoineBeCaptured: function() {
      if (! this.droits) {
        return
      }

      return _.some(this.droits, 'isBaseRessourcesPatrimoine') && this.$store.getters.hasPatrimoine === undefined
    },
    hasWarning: function() {
      return this.accessStatus.forbidden
    },
    hasError: function() {
      return this.resultatStatus.error
    },
    shouldDisplayResults: function() {
      return !(this.resultatStatus.updating || this.hasWarning || this.hasError) && this.droits
    },
    error: function() {
      let value = this.resultatStatus.error && this.resultatStatus.exception
      return (_.isString(value) || value instanceof Error) ? value : JSON.stringify(value, null, 2)
    },
    userAgent: function() {
      return window.navigator.userAgent
    }
  },
  methods: {
    goToFeedback: function(event) {
      this.$ScrollService.go(event, document.getElementById('feedback'));
    },
    isEmpty: function(array) { return ! array || array.length === 0 },
    isNotEmpty: function(array) { return array && array.length !== 0 },
    toggleLinks: function() {
      if (! this.openfiscaTracerURL) {
        this.$store.getters.fetchRepresentation('openfisca_tracer')
          .then(representation => {
            this.openfiscaTracerURL = representation.destination.url
          })

        this.$store.getters.fetchRepresentation('openfisca_axe')
          .then(representation => {
            this.openfiscaAxeURL = representation.destination.url
          })
      }
      this.showExpertLinks = ! this.showExpertLinks
    },
    togglePrivate: function() {
      this.showPrivate = !this.showPrivate
      this.$store.dispatch('compute', this.showPrivate)
    }
  },
  mounted: function () {
    if (this.$route.query && this.$route.query.situationId) {
      if (this.$store.state.situation._id !== this.$route.query.situationId) {
        this.$store.dispatch('fetch', this.$route.query.situationId)
          .then(() => this.$store.dispatch('compute', this.showPrivate))
      } else if (! this.$store.getters.hasResults) {
        this.$store.dispatch('compute', this.showPrivate)
      } // Else nothing to do
    } else if (!this.$store.getters.passSanityCheck) {
      return this.$store.dispatch('redirection', route => this.$router.push(route))
    } else {
      if (this.$store.state.calculs.dirty) {
        this.$store.dispatch('save')
          .then(() => {
            if (this.$store.state.access.forbidden) {
              return
            }
            return this.$store.dispatch('compute')
          })
      } else if(! this.$store.getters.hasResults) {
        this.$store.dispatch('compute')
      }
    }

    let vm = this
    this.stopSubscription = this.$store.subscribe(({type}, { calculs }) => {
      switch (type) {
        case 'setResults':
        {
          calculs.resultats.droitsEligibles.forEach(function(d) {
            vm.$matomo && vm.$matomo.trackEvent('General', 'show', d.label)
          })
          break
        }
        case 'saveComputationFailure':
        {
          vm.$matomo && vm.$matomo.trackEvent('General', 'Error')
          break
        }
      }
    })
  },
  beforeDestroy: function() {
    this.stopSubscription && this.stopSubscription()
  }
}
</script>

<style scoped lang="scss">

h4 {
  margin-top: 0.7em;
}

.container, .panel {
  opacity: 1;
}

.injected .droit-detail-heading {
  padding: 0;
}

.injected .droit-detail-description p {
  margin: 0;
}

pre {
  white-space: pre-wrap;
}

</style>
