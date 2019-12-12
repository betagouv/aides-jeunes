<template>
  <form>
    <div>
      <router-link to="/foyer/resultat/">
        <h2 aria-label="Retour aux résultats">
          <i class="fa fa-arrow-circle-left" aria-hidden="true"></i> Retour aux résultats
        </h2>
      </router-link>
    </div>

    <h3>Le montant indiqué pour {{ longLabel }} vous semble inexact ?</h3>

    <ResultatInattenduPpa v-if="droit.id === 'ppa'" v-bind:montant="droit.montant"></ResultatInattenduPpa>
    <ResultatInattenduYearMinusTwo v-else></ResultatInattenduYearMinusTwo>
  </form>
</template>

<script>

import ResultatInattenduPpa from '@/components/ResultatInattendu/Ppa'
import ResultatInattenduYearMinusTwo from '@/components/ResultatInattendu/YearMinusTwo'

export default {
  name: 'resultat-inattendu',
  components: {
    ResultatInattenduPpa,
    ResultatInattenduYearMinusTwo
  },
  computed: {
    droit: function() { 
      return this.$store.state.calculs.resultats && this.$store.state.calculs.resultats.droitsEligibles.filter((d) => {
        return d.id == this.$route.params.id
      })[0]
    },
    longLabel: function() {
      let prefix = `${this.droit.prefix}${this.droit.prefix && this.droit.prefix.endsWith('’') ? '' : ' '}`
      let label = this.droit.label.toLowerCase()
      return `${prefix}${label}`
    }
  }
}

</script>
