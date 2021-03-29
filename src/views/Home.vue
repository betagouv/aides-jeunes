<template>
  <div id="homepage">
     <div class="container">
        <div class="aj-home-hero">
            <div class="aj-home-hero-content">
                <h1>Avec le simulateur,<br><small>je découvre toutes les aides</small></h1>
                <div class="aj-home-hero-buttons-wrapper">
                    <button v-bind:class="`button ${ctaSize} secondary`"
                            v-on:click="next()"
                            v-analytics="{ action: 'Reprendre ma simulation', category:'Home'}"
                            v-if="hasExistingSituation"
                    >
                        Reprendre ma simulation
                    </button>
                    <button v-bind:class="`button ${ctaSize} primary`"
                    v-on:click="newSituation()"
                    v-analytics="{ action: ctaLabel, category:'Home'}"
                    >
                        {{ctaLabel}}
                    </button>
                </div>
            </div>
        </div>
        <div class="aj-home-illustration">
            <img src="@/assets/images/home_illustration.png" />
        </div>
    </div>
    <!--<div class="container">-->
      <!--<main class="hero">-->
        <!--<img src="./../../public/img/5220.svg" alt="Illustration" />-->

        <!--<div class="hero__container text-center">-->
          <!--<h1>-->
            <!--Évaluez vos droits à <strong>{{ prestationsNationalesCount + partenairesLocauxCount }} aides sociales</strong>. <br />En moins de <strong>7 minutes</strong>.-->
          <!--</h1>-->

          <!--<div class="cta">-->
            <!--<router-link-->
              <!--to="/experimentations"-->
              <!--v-bind:class="`button ${ctaSize} secondary`"-->
              <!--v-if="showExperiment"-->
            <!--&gt;-->
              <!--🚀 Continuer l'expérimentation 🚀-->
            <!--</router-link>-->
            <!--<button v-bind:class="`button ${ctaSize} primary`"-->
              <!--v-on:click="newSituation()"-->
              <!--v-analytics="{ action: ctaLabel, category:'Home'}"-->
            <!--&gt;-->
              <!--{{ctaLabel}}-->
            <!--</button>-->
            <!--<button v-bind:class="`button ${ctaSize} secondary`"-->
              <!--v-on:click="next()"-->
              <!--v-analytics="{ action: 'Reprendre ma simulation', category:'Home'}"-->
              <!--v-if="hasExistingSituation"-->
            <!--&gt;-->
              <!--Reprendre la simulation-->
            <!--</button>-->
          <!--</div>-->
          <!--<p>-->
            <!--Ce questionnaire en ligne simple vous donnera un <strong>montant</strong> et vous donnera <strong>accès aux démarches</strong> pour les <strong>{{ prestationsNationalesCount }}</strong> aides nationales et <strong>{{ partenairesLocauxCount }}</strong> aides locales évaluées par le simulateur.-->
          <!--</p>-->
          <!--<router-link class="" to="/lieux">-->
            <!--Trouver le bon interlocuteur près de chez moi-->
          <!--</router-link>-->
        <!--</div>-->
      <!--</main>-->
    <!--</div>-->
  </div>
</template>

<script>
import Institution from '../lib/Institution'
import reduce from 'lodash/reduce'
import size from 'lodash/size'
import filter from 'lodash/filter'
import mapValues from 'lodash/mapValues'

export default {
  name: 'home',
  data: () => {
    let value = {}
    const types = ['prestationsNationales', 'partenairesLocaux']
    types.forEach(function(type) {
      let providersWithoutPrivatePrestations = mapValues(Institution[type], function(provider) {
        provider = { ...provider}
        provider.prestations = reduce(provider.prestations, function(prestations, prestation, name) {
          if (! prestation.private) {
            prestations[name] = prestation;
          }

          return prestations
        }, {});
        return provider
      })

      value[type] = filter(providersWithoutPrivatePrestations, function(provider) { return size(provider.prestations) })
      value[type + 'Count'] = Object.keys(value[type]).reduce(function(total, provider) {
        return total + size(value[type][provider].prestations)
      }, 0);
    });

    value.showExperiment = Institution.experimentations.length

    return value
  },
  computed: {
    hasExistingSituation: function() {
      return this.$store.getters.passSanityCheck
    },
    ctaLabel: function() {
      return this.hasExistingSituation ? 'Commencer une nouvelle simulation' : 'Je commence'
    },
    ctaSize: function() {
      return this.hasExistingSituation ? 'large' : 'xlarge'
    }
  },
  methods: {
    newSituation: function() {
      this.$store.dispatch('clear', this.$route.query.external_id)
      this.next()
    },
    next: function() {
      this.$store.dispatch('verifyBenefitVariables')
      this.$push()
    },
  }
}
</script>
