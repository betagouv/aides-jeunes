<template>
  <form>
    <div>
      <router-link to="/foyer/resultat/">
        <h2 aria-label="Retour aux résultats">
          <i class="fa fa-arrow-circle-left" aria-hidden="true"></i> Retour aux résultats
        </h2>
      </router-link>
    </div>

    <h3>Le montant indiqué pour {{ longLabel }} vous semble inexact&nbsp;?</h3>

    <ResultatInattenduPpa v-if="droit.id === 'ppa'"></ResultatInattenduPpa>
    <ResultatInattenduYearMinusTwo v-bind:droit="droit" v-else></ResultatInattenduYearMinusTwo>
  </form>
</template>

<script>

import Institution from '@/lib/Institution'
import ResultatInattenduPpa from '@/components/ResultatInattendu/Ppa'
import ResultatInattenduYearMinusTwo from '@/components/ResultatInattendu/YearMinusTwo'

let benefitKeyed = {}
let benefits = []
Institution.forEachBenefit((benefit, benefitId, provider, providerId, level) => {
  const b = Object.assign({id: benefitId, provider: {...provider, id: providerId}, level}, benefit)
  if (b.label === 'Tarification solidaire transports') {
    b.label = `${b.label} - ${provider.label}`
  }
  benefits.push(b)
  benefitKeyed[b.id] = b
})

export default {
  name: 'resultat-inattendu',
  components: {
    ResultatInattenduPpa,
    ResultatInattenduYearMinusTwo
  },
  computed: {
    droit: function() { 
      return benefitKeyed[this.$route.params.id]
    },
    longLabel: function() {
      let prefix = `${this.droit.prefix}${this.droit.prefix && this.droit.prefix.endsWith('’') ? '' : ' '}`
      return `${prefix}${this.droit.label}`
    }
  }
}

</script>
