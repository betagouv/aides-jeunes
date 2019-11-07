<template>
  <div id="homepage">
    <div class="container">
      <main class="hero">
        <div class="hero__container text-center">
          <h1>
            Évaluez vos droits à {{ prestationsNationalesCount + partenairesLocauxCount }} aides sociales.<br/>
            En moins de 7 minutes.
          </h1>

          <a class="button xlarge primary" v-on:click="newSituation()">Évaluer mes droits</a>
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
        var providersWithoutPrivatePrestations = _.mapValues(droitsDescription[type], function(provider) {
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
  methods: {
    newSituation: function() {
      this.$SituationService.clear()
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
