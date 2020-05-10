<template>
  <div id="homepage">
    <div class="container">
      <main class="hero">
        <div class="hero__container text-center">
          <h1>
            Évaluez vos droits à {{ prestationsNationalesCount + partenairesLocauxCount }} aides sociales.<br/>
            En moins de 7 minutes.
          </h1>

          <div>
            <router-link
              to="/experimentations"
              v-bind:class="`button ${ctaSize} secondary`"
              v-if="showExperiment"
            >
              🚀 Continuer l'expérimentation 🚀
            </router-link>
            <a v-bind:class="`button ${ctaSize} primary`"
              v-on:click="newSituation()"
              v-analytics="{ action: ctaLabel, category:'Home'}"
            >
              {{ctaLabel}}
            </a>
            <a v-bind:class="`button ${ctaSize} secondary`"
              v-on:click="next()"
              v-analytics="{ action: 'Reprendre ma simulation', category:'Home'}"
              v-if="hasExistingSituation"
            >
              Reprendre la simulation
            </a>
          </div>
          <p>Ce questionnaire en ligne simple vous donnera un montant mensuel pour chaque prestation et vous donnera accès aux démarches.</p>
        </div>
      </main>
    </div>

    <div class="section">
      <div class="container">
        <div class="panel">
          <h2 class="text-center">
            {{ prestationsNationalesCount }} aides nationales et {{ partenairesLocauxCount }} aides locales évaluées par le simulateur
          </h2>
          <div class="cta">
            <router-link class="button secondary" to="/toutes">
              Accéder à la liste
            </router-link>
            <router-link class="button secondary" to="/ameliorer#proposer-une-aide">
              Proposer une nouvelle aide
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Partenaire from '../lib/Partenaire'
import * as droitsDescription from './../../app/js/constants/benefits'
import _ from 'lodash'

export default {
  name: 'home',
  data: () => {
    let value = {}
    const types = ['prestationsNationales', 'partenairesLocaux']
    types.forEach(function(type) {
        let providersWithoutPrivatePrestations = _.mapValues(droitsDescription[type], function(provider) {
            provider = _.assign({}, provider)
            provider.prestations = _.reduce(provider.prestations, function(prestations, prestation, name) {
                if (! prestation.private) {
                    prestations[name] = prestation;
                }

                return prestations
            }, {});
            return provider
        })

        value[type] = _.filter(providersWithoutPrivatePrestations, function(provider) { return _.size(provider.prestations) })
        value[type + 'Count'] = Object.keys(value[type]).reduce(function(total, provider) {
            return total + _.size(value[type][provider].prestations)
        }, 0);
    });

    const partenaires = Partenaire.all
    value.showExperiment = _.some(partenaires, provider => _.size(provider.prestations))

    return value
  },
  computed: {
    hasExistingSituation: function() {
      return this.$store.getters.passSanityCheck
    },
    ctaLabel: function() {
      return this.hasExistingSituation ? 'Commencer une nouvelle simulation' : 'Évaluer mes droits'
    },
    ctaSize: function() {
      return this.hasExistingSituation ? 'large' : 'xlarge'
    }
  },
  methods: {
    newSituation: function() {
      this.$store.dispatch('clear')
      this.next()
    },
    next: function() {
      this.$push()
    },
  }
}
</script>

<style scoped lang="scss">
.xlarge, .xlarge:active {
  font-size: 2em;
  line-height: 1em;
}

#app {
  height: 100%;
}

.cta {
  display: flex;
  justify-content: space-around;
  align-items: stretch;
}

.hero {
  background-color: #fffa;
}

.hero__container {
  min-height: 55vh;
}

hr {
  border-top: 1px solid #ddd;
}

#homepage {
  background-attachment: fixed;
  background-position: top center;
  background-size: 100%;
  background-repeat: no-repeat;
}

.panel {
  border-color: #d45500;
}
</style>
