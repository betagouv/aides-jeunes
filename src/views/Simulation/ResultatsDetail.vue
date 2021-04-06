<template>
    <div class="aj-unbox">
        <button class="aj-droit-details-back-button button outline small with-icon" type="button" v-on:click="window && window.history.back()">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.25 5.24998H2.87249L6.53249 1.58998C6.82499 1.29748 6.82499 0.817478 6.53249 0.524978C6.23999 0.232478 5.76749 0.232478 5.47499 0.524978L0.532485 5.46748C0.239985 5.75998 0.239985 6.23248 0.532485 6.52498L5.47499 11.4675C5.76749 11.76 6.23999 11.76 6.53249 11.4675C6.82499 11.175 6.82499 10.7025 6.53249 10.41L2.87249 6.74998H11.25C11.6625 6.74998 12 6.41248 12 5.99998C12 5.58748 11.6625 5.24998 11.25 5.24998Z" fill="#030F8F"/>
            </svg>
            Retour aux résultats
        </button>
        <div class="aj-box normal-padding-bottom aj-results-details">
            <DroitsDetails
                :droit="droit"
                :city="situation.menage.depcom"
                :patrimoine-captured="patrimoineCaptured"
                :ressources-year-minus-two-captured="ressourcesYearMinusTwoCaptured" />
        </div>
        <div class="aj-box normal-padding-bottom aj-results-details-feedback-box">
            <Feedback :resultatsId="resultatsId"/>
        </div>
    </div>
</template>

<script>
import DroitsDetails from '../../components/DroitsDetails.vue'
import Institution from '@/lib/Institution'
import Feedback from '@/components/Feedback'

export default {
  name: 'SimulationResultatsDetail',
  components: {
    DroitsDetails,
    Feedback
  },
  data() {
    return {
        window
    }
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
