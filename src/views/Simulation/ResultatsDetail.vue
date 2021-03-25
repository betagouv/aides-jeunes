<template>
  <div class="container">
    <DroitsDetails
        :droit="droit"
        :city="situation.menage.depcom"
        :patrimoine-captured="patrimoineCaptured"
        :ressources-year-minus-two-captured="ressourcesYearMinusTwoCaptured" />
  </div>
</template>

<script>
import _ from 'lodash'

import DroitsDetails from '../../components/DroitsDetails.vue'

export default {
  name: 'SimulationResultatsDetail',
  components: {
    DroitsDetails,
  },
  computed: {
    droits: function() { return this.resultats && this.resultats.droitsEligibles },
    resultats: function() { return this.$store.state.calculs.resultats },
    situation: function() { return this.$store.state.situation },
    droit: function() {
        const droitId = this.$route.params.droitId
        const droit = _.find(this.droits || [], function(droit) {
            return droit.id === droitId;
        });
        return droit || {}
    },
    patrimoineCaptured: function() { return this.$store.getters.hasPatrimoine !== undefined },
    ressourcesYearMinusTwoCaptured: function() { return this.$store.getters.ressourcesYearMinusTwoCaptured },
  },
}
</script>
