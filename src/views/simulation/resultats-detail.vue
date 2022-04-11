<template>
  <div class="aj-unbox">
    <LoadingModal v-if="accessStatus.fetching || resultatStatus.updating">
      <p v-show="accessStatus.fetching">
        Récupération de la situation en cours…
      </p>
      <p v-show="resultatStatus.updating"> Récupération de vos droits… </p>
    </LoadingModal>

    <BackButton
      class="aj-droit-details-back-button small"
      @click="goBack($event)"
      >Retour aux résultats</BackButton
    >

    <div class="aj-box normal-padding-bottom aj-results-details">
      <DroitsDetails
        v-if="droit"
        :droit="droit"
        :droits="droits"
        :city="situation.menage.depcom"
        :patrimoine-captured="patrimoineCaptured"
        :ressources-year-minus-two-captured="ressourcesYearMinusTwoCaptured"
      />
      <DroitsContributions v-if="droit" :droit="droit" />
    </div>

    <div class="aj-box normal-padding-bottom aj-results-details-feedback-box">
      <Feedback />
    </div>
  </div>
</template>

<script>
import DroitsDetails from "../../components/droits-details.vue"
import DroitsContributions from "../../components/droits-contributions.vue"
import Feedback from "@/components/feedback"
import LoadingModal from "@/components/loading-modal"
import ResultatsMixin from "@/mixins/resultats"
import StatisticsMixin from "@/mixins/statistics"
import BackButton from "@/components/buttons/back-button"

export default {
  name: "SimulationResultatsDetail",
  components: {
    BackButton,
    DroitsDetails,
    DroitsContributions,
    Feedback,
    LoadingModal,
  },
  mixins: [ResultatsMixin, StatisticsMixin],
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

      droit && this.$matomo?.trackEvent("General", "showDetails", droit.id)

      this.sendStatistics(this.droits, "showDetails", droitId)
    }
  },
  methods: {
    goBack: function (event) {
      event.preventDefault()
      if (window?.history.length > 2) {
        history.back()
      } else {
        this.$router.push("/simulation/resultats")
      }
    },
  },
}
</script>
