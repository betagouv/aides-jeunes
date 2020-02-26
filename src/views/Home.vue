<template>
  <div id="homepage">
    <div class="main notification warning full-width bye"><div>
      À partir du 1er mars, vous ne pourrez plus faire de simulations sur <a href="https://mes-aides.gouv.fr">mes-aides.gouv.fr</a>. En effet, les aides locales sont désormais disponibles sur <a target="_blank" rel="noopener" href="https://www.mesdroitssociaux.gouv.fr">mesdroitssociaux.gouv.fr</a>.</div>
    </div>
    <div class="container">
      <main class="hero">
        <div class="hero__container text-center">
          <h1>
            Évaluez vos droits à {{ prestationsNationalesCount + partenairesLocauxCount }} aides sociales.<br/>
            En moins de 7 minutes.
          </h1>

          <div v-if="hasExistingSituation">
            <div>
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
          </div>

          <div v-else>

            <div>
              <a v-bind:class="`button ${ctaSize} primary`"
                v-analytics="{ action: ctaLabel, category:'Au revoir'}"
                href="https://mesdroitssociaux.gouv.fr"
                target="_blank" rel="noopener"
              >Évaluer vos droits sur mesdroitssociaux.gouv.fr</a>
            </div>
            <p>
              Ou
              <a v-on:click="newSituation()" v-analytics="{ action: ctaLabel, category:'Continue'}">continuez sur Mes Aides</a>
            </p>
          </div>
          <p>Ce questionnaire en ligne simple vous donnera un montant mensuel pour chaque prestation et vous donnera accès aux démarches.</p>
        </div>
      </main>
    </div>

    <div class="section">
      <div class="container">
        <div class="panel">
          <h2 class="text-center">{{ prestationsNationalesCount }} aides nationales évaluées par le simulateur</h2>
          <div v-for="(provider, index) in sortDecreasing(prestationsNationales)" v-bind:key="'n'+index">
            <hr />
            <ProviderView v-bind:item="provider" />
          </div>
          <h2 class="text-center">{{ partenairesLocauxCount }} aides locales évaluées par le simulateur</h2>
          <div v-for="(provider, index) in sortDecreasing(partenairesLocaux)" v-bind:key="'l'+index">
            <hr />
            <ProviderView v-bind:item="provider" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as droitsDescription from './../../app/js/constants/benefits'
import ProviderView from '@/components/ProviderView'
import _ from 'lodash'
export default {
  name: 'home',
  components: {
    ProviderView
  },
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
    sortDecreasing: function(items) {
      return items.filter(() => 1).sort(function(a, b) {
        return Object.keys(a.prestations).length < Object.keys(b.prestations).length
      });
    }
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
.hero {
  background-color: #fffa;
}
.hero__container {
  min-height: 75vh;
}
.bye {
  display: block;
}
hr {
  border-top: 1px solid #ddd;
}
#homepage {
  background-image: url('./../../public/img/homepage/homepage-5760.png');
  background-attachment: fixed;
  background-position: top center;
  background-size: 100%;
  background-repeat: no-repeat;
}
</style>
