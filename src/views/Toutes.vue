<template>
  <div class="text container">
    <h1>Toutes les aides</h1>

    <div class="section">
      <div class="container">
        <div class="panel">
          <h2 class="text-center">{{ prestationsNationalesCount }} aides nationales évaluées par le simulateur</h2>
          <div v-for="(provider, index) in sortDecreasing(prestationsNationales)" v-bind:key="'n'+index">
            <hr />
            <ProviderView v-bind:id="provider.id" v-bind:item="provider" />
          </div>
          <h2 class="text-center">{{ partenairesLocauxCount }} aides locales évaluées par le simulateur</h2>
          <div v-for="(provider, index) in sortDecreasing(partenairesLocaux)" v-bind:key="'l'+index">
            <hr />
            <ProviderView v-bind:id="provider.id" v-bind:item="provider" />
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import Institution from '@/lib/Institution'
import ProviderView from '@/components/ProviderView'
import size from 'lodash/size'

export default {
  name: 'toutes',
  components: {
    ProviderView
  },
  data: () => {
    let value = {}
    const types = ['prestationsNationales', 'partenairesLocaux']
    types.forEach(function(type) {
        let providersWithoutPrivatePrestations = Object.keys(Institution[type]).map(function(providerName) {
            const provider = {
              id: providerName,
              ...Institution[type][providerName]
            }
            provider.prestations = Object.keys(provider.prestations).reduce(function(prestations, name) {
                const prestation = provider.prestations[name]
                if (!prestation.private) {
                    prestations[name] = prestation;
                }

                return prestations
            }, {});
            return provider
        })

        value[type] = providersWithoutPrivatePrestations.filter(function(provider) { return size(provider.prestations) })
        value[type + 'Count'] = Object.keys(value[type]).reduce(function(total, provider) {
            return total + Object.keys(value[type][provider].prestations).length
        }, 0);
    });
    return value
  },
  methods: {
    sortDecreasing: function(items) {
      return items.filter(() => 1).sort(function(a, b) {
        return Object.keys(a.prestations).length < Object.keys(b.prestations).length
      });
    }
  }
}
</script>
