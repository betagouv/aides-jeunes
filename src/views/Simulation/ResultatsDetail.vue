<template>
  <div class="aj-unbox">
    <LoadingModal v-if="accessStatus.fetching || resultatStatus.updating">
      <p v-show="accessStatus.fetching">
        Récupération de la situation en cours…
      </p>
      <p v-show="resultatStatus.updating">Récupération de vos droits…</p>
    </LoadingModal>

    <button
      class="aj-droit-details-back-button button outline small with-icon"
      type="button"
      v-on:click="goBack($event)"
      data-testid="back"
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.25 5.24998H2.87249L6.53249 1.58998C6.82499 1.29748 6.82499 0.817478 6.53249 0.524978C6.23999 0.232478 5.76749 0.232478 5.47499 0.524978L0.532485 5.46748C0.239985 5.75998 0.239985 6.23248 0.532485 6.52498L5.47499 11.4675C5.76749 11.76 6.23999 11.76 6.53249 11.4675C6.82499 11.175 6.82499 10.7025 6.53249 10.41L2.87249 6.74998H11.25C11.6625 6.74998 12 6.41248 12 5.99998C12 5.58748 11.6625 5.24998 11.25 5.24998Z"
          fill="#030F8F"
        />
      </svg>
      Retour aux résultats
    </button>

    <div class="aj-box normal-padding-bottom aj-results-details">
      <DroitsDetails
        v-if="droit"
        :droit="droit"
        :droits="droits"
        :city="situation.menage.depcom"
        :patrimoine-captured="patrimoineCaptured"
        :ressources-year-minus-two-captured="ressourcesYearMinusTwoCaptured"
      />
    </div>
    <div class="aj-box normal-padding-bottom aj-results-details-feedback-box">
      <Feedback />
    </div>
  </div>
</template>

<script>
import DroitsDetails from "../../components/DroitsDetails.vue"
import Feedback from "@/components/Feedback"
import LoadingModal from "@/components/LoadingModal"
import ResultatsMixin from "@/mixins/Resultats"
import StatisticsMixin from "@/mixins/Statistics"

export default {
  name: "SimulationResultatsDetail",
  components: {
    DroitsDetails,
    Feedback,
    LoadingModal,
  },
  mixins: [ResultatsMixin, StatisticsMixin],
  mounted: function () {
    if (this.mock(this.$route.params.droitId)) {
      return
    } else if (!this.droits) {
      this.restoreLatest()
    } else {
      const droitId = this.$route.params.droitId
      const droit = this.droits.find(function (droit) {
        return droit.id === droitId
      })

      droit &&
        this.$matomo &&
        this.$matomo.trackEvent("General", "showDetails", droit.label)

      this.sendStatistics(this.droits, "showDetails", droitId)
    }
  },
  computed: {
    situation: function () {
      return this.$store.getters.situation
    },
    droit: function () {
      const droitId = this.$route.params.droitId
      const droit = (this.droits || []).find(function (droit) {
        return droit.id === droitId
      })
      return droit
    },
    patrimoineCaptured: function () {
      return this.$store.getters.hasPatrimoine !== undefined
    },
    ressourcesYearMinusTwoCaptured: function () {
      return this.$store.getters.ressourcesYearMinusTwoCaptured
    },
  },
  methods: {
    goBack: function (event) {
      event.preventDefault()
      if (window && window.history.length > 2) {
        history.back()
      } else {
        this.$router.push("/simulation/resultats")
      }
    },
  },
}
</script>
