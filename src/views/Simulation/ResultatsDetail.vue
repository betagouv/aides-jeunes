<template>
  <div class="normal-padding-bottom aj-results-details">
    <DroitsDetails
        :droit="droit"
        :city="situation.menage.depcom"
        :patrimoine-captured="patrimoineCaptured"
        :ressources-year-minus-two-captured="ressourcesYearMinusTwoCaptured" />
  </div>
</template>

<script>
import DroitsDetails from '../../components/DroitsDetails.vue'
import Institution from '@/lib/Institution'

export default {
  name: 'SimulationResultatsDetail',
  components: {
    DroitsDetails,
  },
  computed: {
    droits: function() { return this.resultats && this.resultats.droitsEligibles },
    resultats: function() { return this.$store.state.calculs.resultats },
    resultatsId: function() { return this.resultats && this.resultats._id || '???' },
    situation: function() { return this.$store.state.situation },
    droit: function() {
        const droitId = this.$route.params.droitId
        const droit = (this.droits || Institution.mockResults(droitId).droitsEligibles).find(function(droit) {
            return droit.id === droitId;
        });
        return droit
    },
    patrimoineCaptured: function() { return this.$store.getters.hasPatrimoine !== undefined },
    ressourcesYearMinusTwoCaptured: function() { return this.$store.getters.ressourcesYearMinusTwoCaptured },
  },
}
</script>
