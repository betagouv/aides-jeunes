<template>
  <div>
    <DroitsDetails
        :droit="droit"
        :city="situation.menage.depcom"
        :patrimoine-captured="patrimoineCaptured"
        :ressources-year-minus-two-captured="ressourcesYearMinusTwoCaptured" />
    <Feedback :resultatsId="resultatsId"/>
  </div>
</template>

<script>
import _ from 'lodash'

import DroitsDetails from '../../components/DroitsDetails.vue'
import Feedback from './../../components/Feedback'

export default {
  name: 'SimulationResultatsDetail',
  components: {
    DroitsDetails,
    Feedback,
  },
  computed: {
    droits: function() { return this.resultats && this.resultats.droitsEligibles },
    resultats: function() { return this.$store.state.calculs.resultats },
    resultatsId: function() { return this.resultats && this.resultats._id || '???' },
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
